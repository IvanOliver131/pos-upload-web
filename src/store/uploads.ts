import { create } from "zustand";
import { enableMapSet } from "immer";
import { immer } from "zustand/middleware/immer";
import { uploadFileToStorage } from "../http/upload-file-to-storage";
import { CanceledError } from "axios";
import { useShallow } from "zustand/shallow";
import { compressImage } from "../utils/compress-image";

export enum UploadStatus {
  PROGRESS = "progress",
  SUCCESS = "success",
  ERROR = "error",
  CANCELED = "canceled",
}

export type Upload = {
  name: string;
  file: File;
  abortController: AbortController;
  status: UploadStatus;
  originalSizeInBytes: number;
  uploadSizeInBytes: number;
};

type UploadState = {
  uploads: Map<string, Upload>;
  addUploads: (files: File[]) => void;
  cancelUpload: (uploadId: string) => void;
};

enableMapSet();

// set -> fazer alteração
// get -> pegar dados
export const useUploads = create<UploadState, [["zustand/immer", never]]>(
  immer((set, get) => {
    function updateUpload(uploadId: string, data: Partial<Upload>) {
      const upload = get().uploads.get(uploadId);
      if (!upload) {
        return;
      }
      set((state) => {
        state.uploads.set(uploadId, {
          ...upload,
          ...data,
        });
      });
    }

    async function processUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId); // Dessa forma pego o Upload pelo ID

      if (!upload) return;

      try {
        const compressedFile = await compressImage({
          file: upload.file,
          maxHeight: 200,
          maxWidth: 200,
          quality: 0.5,
        });

        await uploadFileToStorage(
          {
            file: compressedFile,
            onProgress(sizeInBytes) {
              updateUpload(uploadId, {
                uploadSizeInBytes: sizeInBytes,
              });
            },
          },
          { signal: upload.abortController.signal }
        );

        updateUpload(uploadId, { status: UploadStatus.SUCCESS });
      } catch (error) {
        updateUpload(uploadId, {
          status:
            error instanceof CanceledError
              ? UploadStatus.CANCELED
              : UploadStatus.ERROR,
        });
      }
    }

    function cancelUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId);

      if (!upload) return;

      upload.abortController.abort();
    }

    function addUploads(files: File[]) {
      for (const file of files) {
        const uploadId = crypto.randomUUID();
        const abortController = new AbortController();

        const upload: Upload = {
          name: file.name,
          file,
          abortController,
          status: UploadStatus.PROGRESS,
          originalSizeInBytes: file.size,
          uploadSizeInBytes: 0,
        };

        set((state) => {
          state.uploads.set(uploadId, upload);
        });

        processUpload(uploadId);
      }
    }

    return {
      uploads: new Map(),
      addUploads,
      cancelUpload,
    };
  })
);

export const usePendingUploads = () => {
  return useUploads(
    useShallow((store) => {
      const isThereAnyPendingUploads = Array.from(store.uploads.values()).some(
        (upload) => upload.status === UploadStatus.PROGRESS
      );

      if (!isThereAnyPendingUploads) {
        return { isThereAnyPendingUploads, globalPercentage: 100 };
      }

      const { total, uploaded } = Array.from(store.uploads.values())
        .filter((upload) => upload.status === UploadStatus.PROGRESS)
        .reduce(
          (acc, upload) => {
            acc.total += upload.originalSizeInBytes;
            acc.uploaded += upload.uploadSizeInBytes;

            return acc;
          },
          { total: 0, uploaded: 0 }
        );

      const globalPercentage = Math.min(
        Math.round((uploaded * 100) / total),
        100
      );

      return {
        isThereAnyPendingUploads,
        globalPercentage,
      };
    })
  );
};

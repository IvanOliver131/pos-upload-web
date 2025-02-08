import { create } from "zustand";
import { enableMapSet } from "immer";
import { immer } from "zustand/middleware/immer";
import { uploadFileToStorage } from "../http/upload-file-to-storage";

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
    async function processUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId); // Dessa forma pego o Upload pelo ID

      if (!upload) return;

      try {
        await uploadFileToStorage(
          { file: upload.file },
          { signal: upload.abortController.signal }
        );

        set((state) => {
          state.uploads.set(uploadId, {
            ...upload,
            status: UploadStatus.SUCCESS,
          });
        });
      } catch {
        set((state) => {
          state.uploads.set(uploadId, {
            ...upload,
            status: UploadStatus.ERROR,
          });
        });
      }
    }

    function cancelUpload(uploadId: string) {
      const upload = get().uploads.get(uploadId);

      if (!upload) return;

      upload.abortController.abort();

      set((state) => {
        state.uploads.set(uploadId, {
          ...upload,
          status: UploadStatus.CANCELED,
        });
      });
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

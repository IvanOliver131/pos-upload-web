import * as Progress from "@radix-ui/react-progress";

import { Download, ImageUp, Link2, RefreshCcw, X } from "lucide-react";
import { Button } from "./ui/button";

import { motion } from "motion/react";
import { UploadStatus, useUploads, type Upload } from "../store/uploads";
import { formatBytes } from "../utils/format-bytes";

interface UploadWidgetUploadItemProps {
  upload: Upload;
  uploadId: string;
}

export function UploadWidgetUploadItem({
  upload,
  uploadId,
}: UploadWidgetUploadItemProps) {
  const cancelUpload = useUploads((store) => store.cancelUpload);

  const progress = Math.min(
    Math.round((upload.uploadSizeInBytes * 100) / upload.originalSizeInBytes),
    100
  );

  const renderUploadStatusInfo = (uploadStatus: UploadStatus) => {
    switch (uploadStatus) {
      case UploadStatus.SUCCESS:
        return <span>100%</span>;

      case UploadStatus.PROGRESS:
        return <span>{progress}%</span>;

      case UploadStatus.ERROR:
        return <span className="text-red-400">Error</span>;

      case UploadStatus.CANCELED:
        return <span className="text-yellow-400">Canceled</span>;

      default:
        return <span className="text-red-400">Error</span>;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="p-3 rounded-lg flex flex-col gap-3 shadow-shape-content bg-white/2 relative overflow-hidden"
    >
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium flex items-center gap-1">
          <ImageUp className="size-3 text-zinc-300" strokeWidth={1.5} />
          <span className="truncate max-w-[180px] block" title={upload.name}>
            {upload.name}
          </span>
        </span>

        <span className="text-xxs text-zinc-400 flex gap-1.5 items-center">
          <span>{formatBytes(upload.originalSizeInBytes)}</span>
          <div className="size-1 rounded-full bg-zinc-700" />
          <span>
            {formatBytes(upload.uploadSizeInBytes)}
            <span className="text-green-400 ml-1"> -{progress}%</span>
          </span>
          <div className="size-1 rounded-full bg-zinc-700" />
          <span>{progress}%</span>
          <div className="size-1 rounded-full bg-zinc-700" />

          {renderUploadStatusInfo(upload.status)}
        </span>
      </div>

      <Progress.Root
        value={progress}
        data-status={upload.status}
        className="bg-zinc-800 rouned-full h-1 overflow-hidden group"
      >
        <Progress.Indicator
          className={`bg-indigo-500 h-1 transition-all
            group-data-[status=success]:bg-green-400 
            group-data-[status=error]:bg-red-400 
            group-data-[status=canceled]:bg-yellow-400`}
          style={{
            width:
              upload.status === UploadStatus.PROGRESS ? `${progress}%` : "100%",
          }}
        />
      </Progress.Root>

      <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
        <Button
          disabled={upload.status !== UploadStatus.SUCCESS}
          size="icon-sm"
        >
          <Download className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Download compressed image</span>
        </Button>

        <Button
          disabled={upload.status !== UploadStatus.SUCCESS}
          size="icon-sm"
        >
          <Link2 className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Copy remote URL</span>
        </Button>

        <Button
          disabled={
            ![UploadStatus.CANCELED, UploadStatus.ERROR].includes(upload.status)
          }
          size="icon-sm"
        >
          <RefreshCcw className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Retry upload</span>
        </Button>

        <Button
          disabled={upload.status !== UploadStatus.PROGRESS}
          size="icon-sm"
          onClick={() => cancelUpload(uploadId)}
        >
          <X className="size-4" strokeWidth={1.5} />
          <span className="sr-only">Cancel upload</span>
        </Button>
      </div>
    </motion.div>
  );
}

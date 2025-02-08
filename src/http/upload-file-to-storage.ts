import axios from "axios";

interface UploadFileToStorageProps {
  file: File;
  onProgress: (sizeInBytes: number) => void;
}

interface UploadFileToStorageOptions {
  signal?: AbortSignal; // Dessa forma que cancelamos coisas na Web
}

export async function uploadFileToStorage(
  { file, onProgress }: UploadFileToStorageProps,
  options?: UploadFileToStorageOptions
) {
  const data = new FormData();

  data.append("file", file);

  const response = await axios.post("http://localhost:3333/uploads", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    signal: options?.signal,
    onUploadProgress(progressEvent) {
      onProgress(progressEvent.loaded);
    },
  });

  return { url: response.data.url };
}

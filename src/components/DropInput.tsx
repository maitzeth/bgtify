import { cn } from 'maitzeth-ui';
import {useCallback} from 'react';
import {useDropzone} from 'react-dropzone';

type Props = {
  onChange: (file: File) => void;
}

export function DropInput({ onChange }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles.at(0);

    if (file) {
      onChange(file);
    }
  }, [onChange]);

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'image/jpeg': [],
      'image/png': []
    },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={cn(`
        w-full
        h-[400px]
        bg-[#e0e0e0]
        dark:bg-gray-600
        rounded-lg
        border-4
        drop-shadow-sm
        select-none
        border-gray-500
        dark:border-gray-400
        cursor-pointer
        ease-in
        duration-150
        p-4
        flex
        items-center
        justify-center
        focus-visible:!outline-0 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent
      `, { '!border-cyan-500': isDragActive })}
    >
      <div className="text-center text-3xl mt-3 text-gray-500 dark:text-gray-400">
        <input {...getInputProps()} aria-label="Please, select an image file" />
        {
          isDragActive ?
            <p>Drop it, come on.</p> :
            <p>Drag 'n' drop some image with background here, <br /> or click to select file.</p>
        }
        <p>(images are not stored)</p>
      </div>
    </div>
  )
}
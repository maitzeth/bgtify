import imglyRemoveBackground from "@imgly/background-removal";
import { Maybe, Skeleton, Switch, cn } from 'maitzeth-ui';
import { Fragment, useState } from 'react';
import { FaGithub } from "react-icons/fa";
import { MdDownload, MdOutlineDelete } from "react-icons/md";
import { DropInput } from './components/DropInput';
import { Toaster, toast } from 'sonner';
import { getFileNameWithoutExtension, withErrorHandling } from './utils';
import heic2any from "heic2any";

interface StateType {
  bgPreviewImage: Maybe<string>;
  isLoading: Maybe<boolean>;
  filename: Maybe<string>;
  noBgPreviewImage: Maybe<string>;
}

const initialState = {
  bgPreviewImage: null,
  isLoading: false,
  filename: null,
  noBgPreviewImage: null,
};

export default function App() {
  const [isDarkMode, setDarkMode] = useState(true);
  const [state, setState] = useState<StateType>(initialState);
  
  const handleChangeFileInput = withErrorHandling(async (file: File) => {
    setState(prev => ({
      ...prev,
      isLoading: true,
    })); 

    let newFile: File | Blob | undefined;

    if (file.type === 'image/heic') {
      newFile = await heic2any({
        blob: file,
        toType: "image/jpeg",
      }) as Blob;
    } else {
      newFile = file
    }

    const blobResponse = await imglyRemoveBackground(newFile, {
      progress: (key, current, total) => {
        if (key === 'compute:inference') {
          if (current === 0) {
            toast.info(`Processing ${current} of ${total}`);
          } else {
            toast.success(`Congratulations!`)
          }
        }
      }
    });

    const reader = new FileReader();
    reader.readAsDataURL(newFile as Blob);

    reader.onloadend = async () => {
      const preview = reader.result;
      const noBgimageUrl = URL.createObjectURL(blobResponse); 
      const fileName = getFileNameWithoutExtension(file.name);

      setState((prev) => {
        return {
          ...prev,
          bgPreviewImage: preview as string,
          filename: fileName,
          isLoading: false,
          noBgPreviewImage: noBgimageUrl,
        }
      });
    }

    reader.onerror = () => {
      toast('Something weird happened, please try again...');
      setState(initialState);
    }
  });

  const handleReset = () => {
    setState(initialState);
  };

  const handleDarkMode = () => {
    setDarkMode(prev => {
      const isActive = !prev;

      if (isActive) {
        document.documentElement.classList.add('dark');
      }

      if (!isActive) {
        document.documentElement.classList.remove('dark');
      }

      return isActive;
    });
  }

  return (
    <>
      <Toaster />
      <main className="font-body bg-white dark:bg-gray-950 min-h-screen overflow-y-hidden p-4 flex flex-col 2xl:justify-between">
        <div className="flex">
          <section className="flex-1 hidden lg:block"></section>
          <section className="space-y-0 lg:flex-1">
            <h1 className="text-gray-800 dark:text-gray-400 text-[4rem] lg:text-[8rem] text-left lg:text-center font-body leading-none">Bgtify</h1>
            <p className="text-gray-800 dark:text-gray-400 text-[1rem] lg:text-3xl text-left lg:text-center font-body">Remove the background from the image and then easily download it.</p>
          </section>
          <section className="flex-1 justify-end flex">
            <Switch active={isDarkMode} sizeClassName="focus-visible:!outline-0 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-transparent" onChange={handleDarkMode} />
          </section>
        </div>
        <section className={cn("max-w-[1000px] mx-auto w-full mt-8")}>
          <div className={cn("grid grid-cols-1 gap-6", { "grid-cols-2": Boolean(state.bgPreviewImage) })}>
            {state.isLoading && (
              <div role="region" aria-label="Processing image, please wait a couple seconds..." className="relative">
                <Skeleton theme={isDarkMode ? 'light' : 'dark'} width="100%" height={400} />
                <span className="bottom-2 right-2 absolute text-gray-600 dark:text-gray-500 text-3xl">Loading...</span>
              </div>
            )}

            {state.bgPreviewImage && state.noBgPreviewImage ? (
              <Fragment>
                <article className="space-y-3">
                  <img src={state.bgPreviewImage} className="w-full object-cover h-auto" />
                  <button type="button" className="text-white w-full bg-red-500 text-center py-4 px-8 rounded-lg" onClick={handleReset}>
                    <MdOutlineDelete size={24} color="white" className="mx-auto" />
                  </button>
                </article>
                <article className="space-y-3">
                  <img src={state.noBgPreviewImage} className="w-full object-cover h-auto" />
                  <a target="_blank" href={state.noBgPreviewImage} rel="nofollow noopener" download={`${state.filename}.png`} className="block text-white w-full bg-green-500 text-center py-4 px-8 rounded-lg">
                    <MdDownload size={24} color="white" className="mx-auto" />
                  </a>
                </article>
              </Fragment>
            ) : (
              <Fragment>
                {!state.isLoading && (
                  <DropInput onChange={handleChangeFileInput} />
                )}
              </Fragment>
            )}
            
          </div>
        </section>
        <footer className="lg:flex flex-row justify-between text-2xl text-gray-800 dark:text-gray-400 select-none mt-auto lg:mt-auto 2xl:mt-10 space-y-2 lg:space-y-0">
          <p className="min-w-[120px]"><a href="https://github.com/maitzeth" className="hover:underline">maitzeth</a> / <a href="https://andreivan.me/" className="hover:underline">andre ivan</a></p>
          <p className="min-w-[120px]">Powered by <a href="https://img.ly/showcases/cesdk/background-removal/web" target="_blank" rel="nofollow noopener" className="hover:underline">@imgly</a></p>
          <p className="min-w-[120px]"><a href="https://github.com/maitzeth/bgtify" target="_blank" rel="nofollow noopener"><FaGithub size={24} className="lg:ml-auto" /></a></p>
        </footer>
      </main>
    </>
  )
}

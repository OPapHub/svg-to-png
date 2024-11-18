"use client";

import Image from "next/image";
import React, { useState } from "react";
import { handleDownload } from "./(tools)/download";
import DropBox from "./(tools)/dropBox";

const MultiFileInput = () => {
  const [images, setImages] = useState<string[]>([]);
  const [close, setClose] = useState<boolean>(true);
  const [scale, setScale] = useState<number>(1);
  const [custom, setCustom] = useState<string>("");
  const SCALE = [1, 2, 4, 8, 16, 32, 64];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setScale(1);
    const files = event.target.files ? Array.from(event.target.files) : [];
    const imageUrls = files.map((file) => URL.createObjectURL(file));

    setImages((prevImages) => [...prevImages, ...imageUrls]);
    // setClose(false);
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen gap-y-4">
      <label
        htmlFor="multi-file-input"
        className="block text-sm font-medium text-gray-700"
      >
        Upload multiple files
      </label>
      <DropBox setImages={setImages}>
        <label className="border rounded-md bg-background px-3 py-2 ring-offset-background cursor-pointer hover:bg-foreground hover:text-background">
          <span>Upload SVG`s</span>
          <input
            type="file"
            id="multi-file-input"
            multiple
            accept=".svg"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </DropBox>

      {images.length > 0 && (
        <>
          <p className="text-sm font-medium text-gray-500">
            Uploaded images: {images.length}
          </p>
          <button
            onClick={() => {
              setClose((prev) => !prev);
            }}
            className="border rounded-md ring-offset-background px-6 py-2 hover:bg-foreground hover:text-background"
          >
            Show
          </button>
          <div
            className={`${
              close ? "hidden" : "fixed"
            } inset-0 z-50 bg-[#111111] flex items-center justify-center`}
          >
            <div className="h-[calc(100%-20%)] w-[calc(100%-20%)] p-4 pb-0 flex flex-col items-center border rounded-lg">
              {/* {Popup} */}
              <div className="flex justify-between items-center mb-4 w-full">
                <h2 className="text-lg font-bold">Download</h2>
                <button
                  onClick={() => {
                    setClose((prev) => !prev);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✖
                </button>
              </div>
              <div className="flex-1 overflow-y-auto w-full">
                <div className="gap-y-10 gap-x-10 py-5 flex flex-wrap justify-center items-center">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleDownload(index, scale, images, custom)
                      }
                      className="hover:-translate-y-1 hover:scale-105 transition-all"
                    >
                      <Image src={image} width={100} height={100} alt="asda" />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-x-1 flex justify-center items-center my-2 flex-wrap">
                {SCALE.map((num) => (
                  <button                    
                    className={`text-gray-500 text-md p-1 hover:text-gray-400 focus:text-gray-50`}
                    key={num}
                    onClick={() => setScale(num)}
                  >
                    {num}×
                  </button>
                ))}

                <input
                  type="number"
                  className="w-24 ring-offset-background focus:text-gray-50 rounded-md text-gray-500 text-md px-1 py-1 bg-transparent"
                  placeholder="CUSTOM"
                  min={0}
                  max={100}
                  value={custom}
                  onChange={(e) => {
                    const n = parseInt(e.target.value);
                    setCustom(
                      Number.isNaN(n)
                        ? ""
                        : Math.min(100, Math.max(1, n)).toString()
                    );
                  }}
                ></input>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MultiFileInput;

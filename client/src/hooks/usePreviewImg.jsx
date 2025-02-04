import { useState } from "react";

export default function usePreviewImg() {
  const [imgUrls, setImageUrls] = useState("");

  const handleImageChange = async (e) => {
    const files = e.target.files;
    if (files) {
      if (files.length > 1) {
        let imagesUrls = [];
        for (let file of files) {
          const reader = new FileReader();
          await reader.readAsDataURL(file);
          reader.onloadend = () => {
            imagesUrls.push(reader.result);
            setImageUrls(imagesUrls);
          };
        }
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImageUrls([reader.result]);
        };
        reader.readAsDataURL(files[0]);
      }
    }
  };

  return { handleImageChange, imgUrls, setImageUrls };
}

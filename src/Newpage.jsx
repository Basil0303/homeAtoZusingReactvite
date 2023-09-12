// const home = async () => {
//   console.log(data);

//   // Create a FormData object to send files along with other form data
//   const formData = new FormData();

//   // Append each image file to the FormData object
//   data.gallery_imgs.forEach((image, index) => {
//     formData.append(`gallery_imgs[${index}]`, image);
//   });

//   // Append other form fields
//   formData.append("name", data.name);
//   formData.append("home_type_id", data.home_type_id);
//   formData.append("price_per_sqft", data.price_per_sqft);
//   formData.append("cover_image", data.cover_image);
//   formData.append("description", data.description);
//   data.materials.forEach((material, index) => {
//     formData.append(`materials[${index}]`, material);
//   });

//   const response = await apiCall("post", PackageUrl, formData, {
//     headers: {
//       "Content-Type": "multipart/form-data", // Set the content type for file uploads
//     },
//   });

//   console.log(response);
//   getHome();
//   setShow(false);
// };

const home = async () => {
  const response = await apiCall("post", PackageUrl, {
    data: {
      ...data,
      gallery_imgs: data.gallery_imgs, // Include the gallery_imgs array
    },
  });
  console.log(response);
  getHome();
  setShow(false);
};

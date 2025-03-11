import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { app } from "../firebase.js"
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';


export const UpdateListing = () => {

    const [files, setFiles] = useState([]);

    const [formData, setFormData] = useState({
        imageUrls: [],
        title: "",
        description: "",
        address: "",
        category: "",
        type: "",
        contactNo: "",
        price: "",
        negligible: false,

    })

    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const params = useParams();
    //console.log(currentUser._id);
    useEffect(() => {
        const fetchListing = async () => {
            const listingId = params.listingId
            const res = await fetch(`/api/listing/get/${listingId}`)
            const data = await res.json()
            if(data.success === false) {
                console.log(data.message)
                return;
            }
            setFormData(data);
        }

        fetchListing();
    }, []);


    console.log(formData);

    const handleImageSubmit = (e) => {
        if (files.length > 0 && files.length + formData.imageUrls.length < 6) {
            setUploading(true);
            setImageUploadError(false);
            const promises = [];


            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]))
            }

            Promise.all(promises)
                .then((urls) => {
                    setFormData({
                        ...formData,
                        imageUrls: formData.imageUrls.concat(urls),
                    })
                    setImageUploadError(false);
                    setUploading(false);

                })
                .catch((err) => {
                    setImageUploadError("Image upload failed. Max image size is 2MB");
                    setUploading(false);
                })
        } else {
            setImageUploadError("You can upload only five images..");
            setUploading(false);
        }

    }

    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`upload is ${progress}% done`);

                },
                (error) => {
                    reject(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            )
        })
    }

    const handleRemoveImage = (index) => {
        setFormData
            ({
                ...formData,
                imageUrls: formData.imageUrls.filter((_, i) => (i !== index)),
            })
    }

    const handleChange = (e) => {
        const { id, value, type, checked } = e.target;

        if (type === 'radio' && (id === 'brandnew' || id === 'used')) {
            setFormData({
                ...formData,
                type: value,
            });
        } else if (type === 'checkbox' && id === 'negligible') {
            setFormData({
                ...formData,
                negligible: checked,
            });
        } else {
            setFormData({
                ...formData,
                [id]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (formData.imageUrls.length < 1) return setError("You must upload at least one image");

            setLoading(true);
            setError(false);

            const res = await fetch(`/api/listing/update/${params.listingId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                //credentials: "include",
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id,
                }),
            })

            
            const data = await res.json();
            setLoading(false);
            if (data.success === false) {
                setError(data.message);
                return;
            }

            navigate(`/listing/${data._id}`);
        }

        catch (error) {
            setError(error.message);
            setLoading(false);
        }
    }


    return (
        <main className='p-3 max-w-4xl mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>
                Update Listing
            </h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
                <div className='flex flex-col gap-4 flex-1'>
                    <input
                        type='text' placeholder='Title' className='border p-3 rounded-lg'
                        id='title' maxLength='63' minLength='10'
                        required
                        onChange={handleChange}
                        value={formData.title}

                    />

                    <select id='category' className='border p-3 rounded-lg' required
                        onChange={handleChange} value={formData.category}>
                        <option value="" disabled>Select the category</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Automobile">Automobile</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Sports Equipment">Sports Equipment</option>
                    </select>

                    <div className='flex flex-col gap-4'>
                        <span>Type</span>
                        <div className='flex gap-6 flex-wrap'>
                            <div className='flex gap-2'>
                                <input
                                    type='radio' name='type' value='brandnew' id='brandnew' className='w-5'
                                    onChange={handleChange} checked={formData.type == "brandnew"}
                                /><label htmlFor='brandnew'>Brandnew</label></div>
                            <div className='flex gap-2'>
                                <input
                                    type='radio' name='type' value='used' id='used' className='w-5'
                                    onChange={handleChange} checked={formData.type == "used"}
                                /><label htmlFor='used'>Used</label></div>
                        </div>
                    </div>


                    <textarea
                        type='text' placeholder='Description' className='border p-3 rounded-lg'
                        id='description'
                        required
                        onChange={handleChange}
                        value={formData.description}
                    />

                    <input
                        type='text' placeholder='Price' className='border p-3 rounded-lg'
                        id='price'
                        required
                        onChange={handleChange}
                        value={formData.price}
                    />



                    <div className='flex gap-6 flex-wrap'>

                        <div className='flex gap-2' >
                            <input
                                type='checkbox' id='negligible' className='w-5'
                                onChange={handleChange} checked={formData.negligible}
                            /><span>Negligible</span></div>
                    </div>

                    <input
                        type='text' placeholder='Address' className='border p-3 rounded-lg'
                        id='address'
                        required
                        onChange={handleChange}
                        value={formData.address}
                    />

                    <input
                        type='text' placeholder='Contact Number' className='border p-3 rounded-lg'
                        id='contactNo'
                        required
                        onChange={handleChange}
                        value={formData.contactNo}
                    />



                </div >

                <div className='flex flex-col flex-1 gap-4'>
                    <p className='font-semibold'>
                        Images:
                        <span className='font-normal text-gray-600'>
                            The first image will be the cover (max 5)
                        </span>
                    </p>
                    <div className='flex gap-4'>
                        <input
                            onChange={(e) => setFiles(e.target.files)}
                            className='p-3 border border-gray-300 rounded'
                            type='file' id='images' accept='image/*' multiple
                        />

                        <button
                            disabled={uploading}
                            onClick={handleImageSubmit}
                            type='button' className='p-3 text-green-700 rounded  bg-[#44D1B7] border-green-900'>
                            {uploading ? "Uploading..." : "Upload"}
                        </button>

                    </div>
                </div>
                <p className='text-red-700 text-sm'>{imageUploadError}</p>
                {formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                    <div key={url} className='flex justify-between p-3 border items-center'>
                        <img src={url} alt='listing image' className='w-20 h-20 object-contain rounded-lg' />
                        <button type='button' onClick={() => handleRemoveImage(index)} className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'>
                            Delete
                        </button>
                    </div>
                ))}
                <button disabled={loading || uploading }
                    className='p-3 bg-[#44D1B7] text-white rounded gap-10'>{loading ? "Updating..." : "Update Listing"}</button>
                {error && <p className='text-red-700 text-sm'>{error}</p>}
            </form >
        </main >
    )
}

export default UpdateListing

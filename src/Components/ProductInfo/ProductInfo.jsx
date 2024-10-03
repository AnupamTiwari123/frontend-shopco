import { useParams } from "react-router-dom";
import './ProductInfo.css';
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import RelatedProducts from "../RelatedProducts/RelatedProducts";
import ProductReviews from "../Review/ProductReview";

// eslint-disable-next-line react/prop-types
function ProductInfo({ user }) {
    const [product, setProduct] = useState(null);
    const [newArrivalProduct, setNewArrivalProduct] = useState(null);
    const [wishlistError, setWishlistError] = useState('');
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        const fetchProductInfo = async () => {
            try {
        
                const productResponse = await axios.get(`https://backend-shopco.vercel.app/api/products/productinfo/${params.id}`, {
                    withCredentials: true,
                });
                setProduct(productResponse.data);

                const newArrivalResponse = await axios.get(`https://backend-shopco.vercel.app/api/newarrivals/productinfo/${params.id}`, {
                    withCredentials: true,
                });
                setNewArrivalProduct(newArrivalResponse.data);

            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProductInfo();
    }, [params.id]);

    const handleAddToCart = async (productId, price, image) => {
        if (!user) {
            alert('You need to be logged in to add items to the cart');
            return;
        }

        const token = Cookies.get('authToken');

        try {
            const quantity = 1;
            await axios.post(
                `https://backend-shopco.vercel.app/api/cart/add`,
                // eslint-disable-next-line react/prop-types
                { userId: user._id, productId, quantity, price, image },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            alert('Product added to cart');
        } catch (err) {
            alert(`Failed to add product to cart: ${err.message}`);
        }
    };

    const handleAddToWishlist = async (productId, image) => {
        const token = Cookies.get('authToken');

        try {
            await axios.post(
                `https://backend-shopco.vercel.app/api/wishlist`,
                { productId, image },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );
            alert('Added to wishlist!');
        } catch (err) {
            setWishlistError(`Failed to add to wishlist: ${err.message}`);
        }
    };

    if (loading) {
        return <p>Loading product information...</p>;
    }

    if (!product && !newArrivalProduct) {
        return <p>Product not found</p>;
    }


    const displayProduct = newArrivalProduct || product;

    return (
        <>
            <div className="breadcrum">
                Home <i className="fa-solid fa-greater-than"></i> Shop <i className="fa-solid fa-greater-than"></i> {displayProduct.category} <i className="fa-solid fa-greater-than"></i> {displayProduct.name}
            </div>
            <div className="product-section">
                <div className="product-images">
                    <div className="small">
                        <img src={displayProduct.image} alt={displayProduct.name} />
                        <img src={displayProduct.image} alt={displayProduct.name} />
                        <img src={displayProduct.image} alt={displayProduct.name} />
                    </div>
                    <div className="big">
                        <img src={displayProduct.image} alt={displayProduct.name} />
                    </div>
                </div>
                <div className="product-details">
                    <h1>{displayProduct.name}</h1>
                    <p>{displayProduct.ratings}</p>
                    <p>{displayProduct.description}</p>
                    <p>${displayProduct.price ? displayProduct.price : displayProduct.newPrice}</p>
                    <button className='cart-button' onClick={() => handleAddToCart(displayProduct._id, displayProduct.price ? displayProduct.price : displayProduct.newPrice, displayProduct.image)}>Add to Cart</button>
                    <button className="wishlist-button" onClick={() => handleAddToWishlist(displayProduct._id, displayProduct.image)}>Add to Wishlist</button>
                    {wishlistError && <p style={{ color: 'red' }}>{wishlistError}</p>}
                </div>
            </div>
            <hr />
            <br />
            {/* eslint-disable-next-line react/prop-types */}
            {user ? <ProductReviews productId={displayProduct._id} user={user._id} /> : ""}
            <RelatedProducts id={displayProduct.category} />
        </>
    );
}

export default ProductInfo;

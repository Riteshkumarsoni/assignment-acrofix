import {useNavigate} from 'react-router-dom'
import './index.css'

const ProductCard = (props) => {
    const {productData} = props
    const {productId, productName, pricePerUnit, productImgUrl} = productData
    const navigate = useNavigate()

    const onProductBuy = () => {
        navigate(`/order/${productId}`)
    }

    return (
        <div className='product-card-bg-container'>
            <img src={productImgUrl} alt={productName} className='product-img' />
            <h1 className='product-name'>{productName}</h1>
            <p className='product-price'>₹{pricePerUnit}</p>
            <button className='buy-now-btn' type='button' onClick={onProductBuy}>Buy Now</button>
        </div>
    )
}

export default ProductCard
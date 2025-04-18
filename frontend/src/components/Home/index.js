import {Component} from 'react'
import { ClipLoader } from 'react-spinners'
import Header from '../Header'
import ProductCard from '../ProductCard'
import './index.css'

const apiConstants = {
    initial: 'INITIAL',
    success: 'SUCCESS',
    in_progress: 'IN_PROGRESS',
    failure: 'FAILURE'
}

class Home extends Component{
    state = {products: [], apiStatus: apiConstants.initial}

    componentDidMount(){
        this.getProducts()
    }

    getProducts = async () => {
        this.setState({apiStatus: apiConstants.in_progress})
        const response = await fetch(`${process.env.REACT_APP_API_URL}/products`)
        const fetchedData = await response.json()
        const updatedData = fetchedData.map(eachItem => ({
            productId: eachItem.product_id,
            createdAt: eachItem.created_at,
            productName: eachItem.product_name,
            pricePerUnit: eachItem.price_per_unit,
            productImgUrl: eachItem.product_img_url
        }))
        if(response.ok){
            this.setState({products: updatedData, apiStatus: apiConstants.success})
        }
        else{
            this.setState({apiStatus: apiConstants.failure})
        }
    }

    renderSuccess = () => {
        const {products} = this.state
        return (
            <div className='product-card-home-container'>
            {
                products.map(eachItem => <ProductCard key={eachItem.product_id} productData={eachItem} />)
            }
            </div>
        )
    }
    
    renderFailure = () => (
        <div className='failure-container'>
            <img src="https://res.cloudinary.com/dh8g9mloe/image/upload/v1743873558/GithubVisualizer/lxxrvrghrfmad5qfbdgv.png" alt="failure" className='failure-img' />
        </div>
    )

    renderInProgress = () => (
        <div className='loader-container'>
            <ClipLoader height={50} width={50} color="#bh125b" />
        </div>
    )

    renderSwitchOperation = () => {
        const {apiStatus} = this.state
        switch(apiStatus){
            case apiConstants.success:
                return this.renderSuccess();
            case apiConstants.failure:
                return this.renderFailure();
            case apiConstants.in_progress:
                return this.renderInProgress()
            default:
                return null
        }
    }

    render(){
        const {products} = this.state
        return (
            <>
                <Header />
                {this.renderSwitchOperation()}
            </>
        )
    }
}

export default Home
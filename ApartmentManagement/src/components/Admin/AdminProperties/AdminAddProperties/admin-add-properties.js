import React, { Component } from 'react';
import ReactDOM from 'react';
import { NavLink, withRouter } from 'react-router-dom'
import './admin-add-properties.css';
import { PlusCircle } from 'react-feather'
import rentManagerApi from '../../../../api/api-client'
import swal from 'sweetalert2'
import firebase from 'firebase'


class AdminAddProperties extends Component {

    constructor(props) {
        super(props)
        this.state = {
            property: '',
            owners: '',
            uploadValue: 0,
            picture: "../img/default-image.png"
        }
    }

    componentDidMount = () => {

        rentManagerApi.getOwners()
            .then(owners => {
                this.setState({owners})
            })
    }

    handleChange = (e) => {
        const {name, value} = e.target;
        let property = {...this.state.property};
        property[name] = value;
        this.setState({property});
    }

    handleUpload = (e) => {
        const file = e.target.files[0]
        const storageRef = firebase.storage().ref(`/pictures/${file.name}`)
        const task = storageRef.put(file)

        task.on('state_changed', snapshot => {
            let percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            this.setState({
                uploadValue: percentage
            })
        }, error => {console.log(error.message)
        }, ()=> {
            this.setState({
                uploadValue: 100,
                picture: task.snapshot.downloadURL
            })
        })
    }

    createProperty = (e) => {
        e.preventDefault() 
        let { reference, owner, address, rooms, sqm, price, neighbourhood } = this.state.property       
        let picture = this.state.picture
        let status = 'free'
        let roomsInt = parseInt(rooms)
        let sqmInt = parseInt(sqm)
        let priceInt = parseInt(price)

        rentManagerApi.createProperty(owner, reference, address, roomsInt, sqmInt, priceInt, neighbourhood, picture, status)
            .then(result=> {
                if (result.data.status === 'OK') {
                    swal({
                        title: 'Property created!',
                        text: 'You are being redirected',
                        type: 'success',
                        showConfirmButton: false,
                        timer: 2500,
                        onOpen: () => {
                            swal.showLoading()
                          }                         
                     })
                     .then(()=> {
                        this.props.history.push("/back/admin/properties")
                     })
                } else {
                    swal({
                        type: 'error',
                        title: 'Oops...',
                        text: 'Something went wrong!',
                      })
                }
            })
    }

    render() {
        return (
            <main role="main" className="col-md-10 ml-sm-auto col-lg-10 pt-3 px-4">
                { this.state.owners ?
                <div className="container-fluid edit-apartments-module">
                    <div className="row mt-5">
                        <form className="col-lg-5 col-sm-12 mb-5">
                            <div className="container-fluid">
                                <div className="row">
                                <div className="form-group col-12 col-lg-8">
                                        <label htmlFor="property">Property</label>
                                        <input
                                        type="text" 
                                        className="form-control"
                                        id="property"
                                        placeholder="Property"
                                        name="reference"
                                        onChange = {this.handleChange}
                                        required />
                                    </div>
                                    <div className="form-group col-12 col-lg-4">
                                        <label htmlFor="price">Price</label>
                                        <input
                                        type="text" 
                                        className="form-control"
                                        id="price"
                                        placeholder="Price"
                                        name="price"
                                        onChange = {this.handleChange}
                                        required />
                                    </div>
                                    <div className="form-group col-12">
                                        <label htmlFor="address">Address</label>
                                        <input 
                                        type="text" 
                                        className="form-control" 
                                        id="address" 
                                        placeholder="Address"
                                        name="address"                                        
                                        onChange = {this.handleChange}
                                        required />
                                    </div>  
                                    <div className="form-group col-12 col-lg-3">
                                        <label htmlFor="rooms">Rooms</label>
                                        <input 
                                        type="number" 
                                        className="form-control" 
                                        id="rooms" 
                                        name="rooms"
                                        placeholder="Rooms"                                         
                                        onChange = {this.handleChange}
                                        required/>
                                    </div>
                                    <div className="form-group col-12 col-lg-3">
                                        <label htmlFor="rooms">Sqm</label>
                                        <input 
                                        type="number" 
                                        className="form-control" 
                                        id="sqm" 
                                        name="sqm"
                                        placeholder="Square meters"                                         
                                        onChange = {this.handleChange}
                                        required/>
                                    </div>
                                    <div className="form-group col-12 col-lg-6">
                                        <label htmlFor="neighbourhood">Neighbourhood</label>
                                        <select 
                                        className="custom-select" 
                                        name="neighbourhood"
                                        onChange = {this.handleChange}>
                                            <option value=""> </option>
                                            <option value="Srinivasnagar">Srinivasnagar</option>
                                            <option value="Ramkrishnanagar">Ramkrishnanagar</option>
                                            <option value="RK-Layout">RK-Layout</option>
                                            <option value="Basavangudi">Basavangudi</option>
                                            <option value="Rajajinagar">Rajajinagar</option>
                                            <option value="Surathkal">Surathkal</option>
                                            <option value="raval">Raval</option>
                                        </select>
                                    </div>
                                    <div className="form-group col-12">
                                        <label htmlFor="owner">Owner</label>
                                        <div className="container-fluid">
                                            <div className="row">
                                                <select 
                                                className="col-10 custom-select" 
                                                name="owner"                                                 
                                                onChange = {this.handleChange}
                                                >
                                                    <option value=''> </option>
                                                    {this.state.owners.map(owner => {
                                                    return <option key={owner._id} value={owner._id}>{owner.name} {owner.surname}</option>
                                                    })}                                                                                        
                                                </select>
                                                <NavLink className="col-2 mt-2" to="/back/admin/owners/add"><PlusCircle/></NavLink>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button 
                                        className="btn btn-danger"
                                        onClick = {(e) => {e.preventDefault;
                                                    this.createProperty(e)}}
                                        >CREATE
                                        </button>
                                    </div>

                                </div>
                            </div>                
                        </form>                                
                        <div className="card col-lg-6 col-sm-12 p-0">
                            <img className="card-img-top upload-image" src={this.state.picture} alt="card-img-top" />
                            <div className="card-body col-lg-6 col-sm-12">
                                <progress value={this.state.uploadValue} mx="100"></progress>
                                <br/>
                                <input type="file" onChange={this.handleUpload}/>
                            </div>
                            
                        </div>
                    </div>
                </div>
                :undefined}
            </main>





        )
    }
}


export default withRouter(AdminAddProperties)
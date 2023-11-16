import React from "react";
import './Home.scss'
function Home() {
    return (
        <div className="d-flex p-3">
            <div className="d-flex home-wrapper m-auto">
                <div>
                    Home
                </div>
                
                <div className="dropdown">
                    <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                        Dropdown button
                    </button>
                    <ul className="dropdown-menu">
                        <li><a className="dropdown-item" href="#">Action</a></li>
                        <li><a className="dropdown-item" href="#">Another action</a></li>
                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default Home;
import React from 'react';
import { Link } from 'react-router-dom';
import './DestinationGrid.css';

const DestinationGrid = () => {
    // Data array to keep the code clean
        const districts = [
        {
            name: "PUTTALAM",
            subtitle: "Coastal Charm & Lagoons",
            image: "/images/tourism/puttalama.jpg",
            link: "/puttalama"
        },
        {
            name: "KURUNEGALA",
            subtitle: "Ancient Kingdom & Rock Fortress",
            image: "/images/tourism/kurunegala.jpg",
            link: "/kurunegala"
        },
        {
            name: "KANDY",
            subtitle: "Central Hills & Heritage",
            image: "/images/tourism/kandy.jpg",
            link: "/kandy"
        },
        
        {
            name: "GALLE",
            subtitle: "Colonial Fort & Southern Beaches",
            image: "/images/tourism/galle.jpg",
            link: "/galle"
        },
        {
            name: "JAFFNA",
            subtitle: "Northern Culture & Temples",
            image: "/images/tourism/jaffna.jpg",
            link: "/jaffna"
        },
        {
            name: "Colombo",
            subtitle: "Northern Culture & Temples",
            image: "/images/tourism/colombo.jpg",
            link: "/jaffna"
        }
    ];

    return (
        <section className="destinations-grid-section">
            <div className="destinations-grid">
                {districts.map((district, index) => (
                    <Link to={district.link} key={index} className="destination-card">
                        <div className="card-image">
                            <img src={district.image} alt={district.name} />
                        </div>
                        <div className="card-content">
                            <span className="card-subtitle">{district.subtitle}</span>
                            <h3 className="card-title">{district.name}</h3>
                            <span className="card-link">
                                <i className="fas fa-arrow-right"></i>
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default DestinationGrid;
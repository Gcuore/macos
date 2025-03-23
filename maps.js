export async function initMaps(windowId) {
    const content = `
        <div class="maps-app">
            <div class="maps-sidebar">
                <div class="maps-search">
                    <input type="text" placeholder="Search maps">
                    <button class="search-btn">
                        <svg viewBox="0 0 24 24"><path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/></svg>
                    </button>
                </div>
                <div class="recent-locations">
                    <h3>Recent</h3>
                    <div class="location-item">
                        <svg viewBox="0 0 24 24"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/></svg>
                        <span>Home</span>
                    </div>
                    <div class="location-item">
                        <svg viewBox="0 0 24 24"><path d="M12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5M12,2A7,7 0 0,0 5,9C5,14.25 12,22 12,22C12,22 19,14.25 19,9A7,7 0 0,0 12,2Z"/></svg>
                        <span>Work</span>
                    </div>
                </div>
            </div>
            <div class="maps-content">
                <div id="map-${windowId}" class="map-container"></div>
                <div class="map-controls">
                    <button class="zoom-in">+</button>
                    <button class="zoom-out">−</button>
                    <button class="my-location">
                        <svg viewBox="0 0 24 24"><path d="M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8M12,10A2,2 0 0,0 10,12A2,2 0 0,0 12,14A2,2 0 0,0 14,12A2,2 0 0,0 12,10M10,22C9.75,22 9.54,21.82 9.5,21.58L9.13,18.93C8.5,18.68 7.96,18.34 7.44,17.94L4.95,18.95C4.73,19.03 4.46,18.95 4.34,18.73L2.34,15.27C2.21,15.05 2.27,14.78 2.46,14.63L4.57,12.97L4.5,12L4.57,11L2.46,9.37C2.27,9.22 2.21,8.95 2.34,8.73L4.34,5.27C4.46,5.05 4.73,4.96 4.95,5.05L7.44,6.05C7.96,5.66 8.5,5.32 9.13,5.07L9.5,2.42C9.54,2.18 9.75,2 10,2H14C14.25,2 14.46,2.18 14.5,2.42L14.87,5.07C15.5,5.32 16.04,5.66 16.56,6.05L19.05,5.05C19.27,4.96 19.54,5.05 19.66,5.27L21.66,8.73C21.79,8.95 21.73,9.22 21.54,9.37L19.43,11L19.5,12L19.43,13L21.54,14.63C21.73,14.78 21.79,15.05 21.66,15.27L19.66,18.73C19.54,18.95 19.27,19.04 19.05,18.95L16.56,17.95C16.04,18.34 15.5,18.68 14.87,18.93L14.5,21.58C14.46,21.82 14.25,22 14,22H10Z"/></svg>
                    </button>
                </div>
            </div>
        </div>
    `;

    setTimeout(() => {
        initMapsFunctionality(windowId);
    }, 0);

    return content;
}

async function initMapsFunctionality(windowId) {
    try {
        const mapScript = document.createElement('script');
        mapScript.src = `https://maps.googleapis.com/maps/api/js?key=${config.mapsApiKey}`;
        document.head.appendChild(mapScript);

        await new Promise(resolve => mapScript.onload = resolve);

        const mapContainer = document.getElementById(`map-${windowId}`);
        const map = new google.maps.Map(mapContainer, {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8,
            styles: [
                {
                    featureType: "all",
                    elementType: "labels.text.fill",
                    stylers: [{ color: "#333333" }]
                }
            ]
        });

        const searchInput = document.querySelector(`#${windowId} .maps-search input`);
        const searchBtn = document.querySelector(`#${windowId} .search-btn`);
        const locationItems = document.querySelectorAll(`#${windowId} .location-item`);
        const zoomIn = document.querySelector(`#${windowId} .zoom-in`);
        const zoomOut = document.querySelector(`#${windowId} .zoom-out`);
        const myLocation = document.querySelector(`#${windowId} .my-location`);

        searchBtn.addEventListener('click', () => {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: searchInput.value }, (results, status) => {
                if (status === 'OK') {
                    map.setCenter(results[0].geometry.location);
                    new google.maps.Marker({
                        map: map,
                        position: results[0].geometry.location
                    });
                }
            });
        });

        zoomIn.addEventListener('click', () => {
            map.setZoom(map.getZoom() + 1);
        });

        zoomOut.addEventListener('click', () => {
            map.setZoom(map.getZoom() - 1);
        });

        myLocation.addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const pos = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };
                        map.setCenter(pos);
                        map.setZoom(15);
                    },
                    () => {
                        console.error("Error: The Geolocation service failed.");
                    }
                );
            }
        });
    } catch (error) {
        console.error("Error initializing maps:", error);
    }
}
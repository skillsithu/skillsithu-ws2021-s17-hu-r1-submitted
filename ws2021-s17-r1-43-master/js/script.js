window.onload = () => {
    const contactForm = document.getElementById('contact-form');
    contactForm.onsubmit = (e) => {
        e.preventDefault();
        contactForm.parentElement.innerHTML = `Dear ${e.target.firstname.value}! Thank you for your message.`;
    }

    const mapImage = document.getElementById('map-image');
    const zoomPlus = document.getElementById('zoom-plus');
    const zoomMinus = document.getElementById('zoom-minus');
    var mapState = 0;
    const setMapState = (state) => {
        if (state > 1 || state < -1)
            return;
        switch(state) {
            case -1:
                mapImage.src = 'images/shanghai_park_map-.png';
                zoomMinus.classList.add('inactive');
                break;
            case 0:
                mapImage.src = 'images/shanghai_park_map.png';
                zoomPlus.classList.remove('inactive');
                zoomMinus.classList.remove('inactive');
                break;
            case 1:
                zoomPlus.classList.add('inactive');
                mapImage.src = 'images/shanghai_park_map+.png';
                break;
        }
        mapState = state;
    }
    zoomPlus.onclick = () => setMapState(mapState + 1);
    zoomMinus.onclick = () => setMapState(mapState - 1);

    const modalImage = document.getElementById('image-view');
    for (const image of document.getElementById('gallery').getElementsByTagName('img'))
        image.onclick = () => {
            modalImage.src = image.src;
            $('#image-modal').modal('show');
        }

    fetch('data/shanghai_park_flats.json').then(data => data.json()).then(floors => {
        const flatsTbody = document.getElementById('flats-tbody');
        const currentFloor = document.getElementById('current-floor');
        const changeFloor = (floorId) => {
            flatsTbody.innerHTML = '';
            currentFloor.innerHTML = `The current floor: ${floorId}`;
            const floor = floors[floorId];
            for(const flatId of Object.keys(floor))
            {
                const flat = floor[flatId];
                flatsTbody.innerHTML = flatsTbody.innerHTML + `
                    <tr>
                        <th scope="col">${flatId}</th>
                        <th scope="col">${flat.rooms}</th>
                        <th scope="col">${flat.net_area}</th>
                        <th scope="col">${flat.sales_area}</th>
                        <th scope="col">${flat.orientation}</th>
                        <th scope="col">${flat.price_eur || 'Sold'}</th>
                    </tr>
                `;
            }
        }
        changeFloor(0);
        document.getElementById('select-floor').onchange = (e) => changeFloor(e.target.value);
        document.getElementById('flats-button').onclick = () => $('#flats-modal').modal('show');
    })
}

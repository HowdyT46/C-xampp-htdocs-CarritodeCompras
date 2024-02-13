const cards             = document.getElementById('cards')
const items             =document.getElementById('items')
const footer            =document.getElementById('footer')

const templateCard      =document.getElementById('template-card').content
const templateFooter    =document.getElementById('template-footer').content
const templatecarrito   =document.getElementById('template-carrito').content

const fragmento         =document.createDocumentFragment()


//------------------------------------------------se crea el objeto carrito vacio
let carrito = {}
 

//------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        mostrarCarrito()
    }
})
 
// ----------------------------------------------- Evento on Click
cards.addEventListener('click', e => {
    addCarrito(e)
})
items.addEventListener('click',e =>{
    btnAccion(e)
})
const fetchData = async () =>{
    try{
        const res= await fetch('api.json')
        const data= await res.json()
        //console.log(data)
        mostrarProductos(data)
    }catch(error){
        console.log(error)
    }
}

//------------------------------------------------Mostrar producto
const mostrarProductos = data => {
    console.log(data)
     data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent=producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.ThumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone= templateCard.cloneNode(true)
        fragmento.appendChild(clone)

    });
    cards.appendChild(fragmento)
}

//--------------------------------------------------Dar salida al carrito

const addCarrito = e =>{
    if(e.target.classList.contains('btn-dark')){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}
const setCarrito  = objeto =>{
    const producto={
        id:objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad:1
    }
    
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] ={...producto}
    mostrarCarrito()

    //console.log(carrito)
    
}

const mostrarCarrito = () =>{
    items.innerHTML=''
    Object.values(carrito).forEach(producto =>{
        templatecarrito.querySelectorAll('th').textContent = producto.id
        templatecarrito.querySelectorAll('td')[0].textContent = producto.title
        templatecarrito.querySelectorAll('td') [1].textContent = producto.cantidad
        templatecarrito.querySelector('.btn-info').dataset.id =producto.id
        templatecarrito.querySelector('.btn-danger').dataset.id =producto.id
        templatecarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        
        const cloneProducto= templatecarrito.cloneNode(true)
        fragmento.appendChild(cloneProducto)
    })

    items.appendChild(fragmento)
    
    mostrarfooter()

    localStorage.setItem('carrito', JSON.stringify(carrito))
}

const mostrarfooter =() => {
    footer.innerHTML=''
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacio - comience a comprar!</th>
        `
        return
    }

    const nCantidad = Object.values(carrito).reduce((acc,{cantidad}) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad*precio, 0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio
    const clone = templateFooter.cloneNode(true)
    fragmento.appendChild(clone)
    footer.appendChild(fragmento)

    const btnVaciar= document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click',() => {
        carrito = {}
        mostrarCarrito()
    })
}

const btnAccion = e => {
    console.log(e.target)
    if(e.target.classList.contains('btn-info')){
        console.log(carrito[e.target.dataset.id])
        const producto =carrito[e.target.dataset.id]
        producto.cantidad ++
        carrito[e.target.dataset.id] = {...producto}
        mostrarCarrito()
    }
    if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad===0){
            delete carrito[e.target.dataset.id]   
        }
        mostrarCarrito()
    }
    e.stopPropagation()
    
}
/*


*/

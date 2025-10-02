


let compra1={ id:1001,
    estilo: "cargo", 
    cantidad: 2,
    valorTotal: 200.0,
    }

let compra2={ id:1002,
    estilo: "clasico", 
    cantidad: 3,
    valorTotal: 150.0,
    }

let compra3={ id:1002,
    estilo: "clasico", 
    cantidad: 3,
    valorTotal: 250.0,
    }

let carritoCompra=[];
carritoCompra.push(compra1); //subimos la compra al array del carrito
carritoCompra.push(compra2);
carritoCompra.push(compra3);

console.log(carritoCompra)

console.log("este es tu carro de comrpas")

for(let i=0; i<carritoCompra.length; i++){
    console.log(`${i} -- id ${carritoCompra[i].id}-- estilo ${carritoCompra[i].estilo}-- cantidad ${carritoCompra[i].cantidad}`)
    }

    op=parseInt(prompt(`escoeg la pocicion que deseas editar entre 0 y ${carritoCompra.length-1}`));




    alert(`vas a editar la ref ${carritoCompra[op].id}--estilo ${carritoCompra[op].estilo}`);


    opswitch=parseInt(prompt("escoge que deseas hacer: 1- borrar 2-cmabiar cantidad 0-volver"));

        switch (opswitch) {
            case 1:
                carritoCompra.splice(op,1);
                break;
            case 2:
                cant=parseInt(prompt("ingresa la cantiad a editar"))
                carritoCompra[op].cantidad=cant;
                break;
            default:
                break;
        }

    
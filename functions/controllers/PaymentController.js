const PaymentService = require("../services/PaymentService"); 
//importamos el service

class PaymentController {
    constructor() {
      this.paymentService = new PaymentService(); 
    }
  
    async getMercadoPagoLink(req, res) {
        const { name, price, unit } = req.body; 
        try {
          const checkout = await this.paymentService.createPaymentMercadoPago(
            name, // nombre del producto o servicio
            price, //precio del producto o servicio
            unit  //cantidad que estamos vendiendo
          );
    
        //   return res.redirect(checkout.init_point); 
        //  //si es exitoso los llevamos a la url de Mercado Pago
    
          return res.status(202).json({url: checkout.init_point})
         // o si queres devolver la url al front 
  
      } catch (err) { 
  
        return res.status(500).json({
          error: true,
          msg: "Hubo un error con Mercado Pago"
        });
      }
    }
  
   webhook(req, res) { 
      if (req.method === "POST") { 
        let body = ""; 
        req.on("data", chunk => {  
          body += chunk.toString();
        });
        req.on("end", () => {  
          console.log(body, "webhook response"); 
          res.end("ok");
        });
      }
      return res.status(200); 
    }
  }
  module.exports = PaymentController;
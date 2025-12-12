// let myScript = document.createElement("script");
// myScript.setAttribute("src", "https://code.jquery.com/jquery-3.3.1.min.js");
// document.body.appendChild(myScript);

// let myScript1 = document.createElement("script");
// myScript.setAttribute("src", "https://scripts.sandbox.bka.sh/versions/1.2.0-beta/checkout/bKash-checkout-sandbox.j");
// document.body.appendChild(myScript1);

export function test1(){
    console.log('Calling test 1 function');
}
var paymentID = '';
export function bKashCall(){
    console.log("loading...")
  InitFunc();
  console.log("Init end")
}

function InitFunc(){
    bKash.init({ 
        paymentMode: 'checkout', //fixed value ‘checkout’ 
        //paymentRequest format: {amount: AMOUNT, intent: INTENT} 
        //intent options 
        //1) ‘sale’ – immediate transaction (2 API calls) 
        //2) ‘authorization’ – deferred transaction (3 API calls) 
        paymentRequest: { 
          amount: '100.50', //max two decimal points allowed 
          intent: 'sale' 
        }, 
        createRequest: function(request) {
          console.log("Create Request") //request object is basically the paymentRequest object, automatically pushed by the script in createRequest method 
        $.ajax({ 
         // url: 'http://localhost:4008/b2b/paymentGateway/createbKashPayment',
           url: 'https://booking247.com:4008/b2b/paymentGateway/createbKashPayment', 
          type: 'POST', 
          contentType: 'application/json',  
          headers:{
            'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJyb2xlX2lkIjoyLCJKd3RleHBpcmVzSW5TZWNvbmRzIjo5MDAwMCwiaWF0IjoxNjIyMjA5MzcwLCJleHAiOjE2MjIyMTI5NzB9.hurtTBUq0XD5W2gfbqlxvyjp6I8fJNTfn-aIuQEEPVo'
        }, 
          data: JSON.stringify({ 
              
                  "amount": 500,
                  "currency": "BDT",
                  "intent": "authorization",
                  "merchantInvoiceNumber": "Inv002",
                  "merchantAssociationInfo":"MI05MID54RF09123456789",
                  "domain_origin":1,
                   "app_reference":"ASDFR3 ",
                   "currency_conversion_rate":1,
                   "payment_type":"bKash",
                   "currencyCode":"050"
                   
            }), 
          success: function(data) { 
              console.log("Response",data)
              data=data.data
             
              console.log("Payment ID", data.paymentID)
            if (data && data.paymentID != null) { 
              paymentID = data.paymentID; 
              bKash.create().onSuccess(data); //pass the whole response data in bKash.create().onSucess() method as a parameter 
            } else { 
              bKash.create().onError(); 
            } 
          }, 
          error: function() { 
            bKash.create().onError(); 
          } 
        }); 
      },
      executeRequestOnAuthorization: function() { 
        $.ajax({ 
          //url: 'http://localhost:4008/b2b/paymentGateway/executebKashPayment',
           url: 'https://booking247.com:4008/b2b/paymentGateway/executebKashPayment', 
          type: 'POST', 
          contentType: 'application/json',
          headers:{
            'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJyb2xlX2lkIjoyLCJKd3RleHBpcmVzSW5TZWNvbmRzIjo5MDAwMCwiaWF0IjoxNjIyMjA5MzcwLCJleHAiOjE2MjIyMTI5NzB9.hurtTBUq0XD5W2gfbqlxvyjp6I8fJNTfn-aIuQEEPVo'},
          data: JSON.stringify({ 
            "paymentID": paymentID,
            "domain_origin":1,
            "app_reference":"ASDFR3",
            "currency_conversion_rate":1  
          }), 
          success: function(data) { 
            data = data;
            console.log("Data",data)
            if (data && data.data.paymentID != null) {
                  console.log(data) 
              window.location.href = "http://localhost:4201/auth/login";//Merchant’s success page 
            } else { 
              bKash.execute().onError(); 
            } 
          }, 
          error: function() { 
            bKash.execute().onError(); 
          } 
        }); 
      } , 
      });
}


// let paymentID = ''; 
// function bKashCall12(){

//   //payment()
  
  
// }
// function bKashCall(){
//   $.getScript('https://scripts.sandbox.bka.sh/versions/1.1.0-beta/checkout/bKash-checkout-sandbox.js')
//   .done(function(script){
//  bKash.init({ 
//         paymentMode:'checkout', //fixed value ‘checkout’ 
//         //paymentRequest format: {amount: AMOUNT, intent: INTENT} 
//         //intent options 
//         //1) ‘sale’ – immediate transaction (2 API calls) 
//         //2) ‘authorization’ – deferred transaction (3 API calls) 
//         paymentRequest: { 
//           amount: '100.50', //max two decimal points allowed 
//           intent: 'authorization' 
//         }, 
//         createRequest: function(request) {
//             console.log("Create Request") //request object is basically the paymentRequest object, automatically pushed by the script in createRequest method 
//           $.ajax({ 
//            // url: 'http://localhost:4008/b2b/paymentGateway/createbKashPayment',
//              url: 'https://booking247.com:4008/b2b/paymentGateway/createbKashPayment', 
//             type: 'POST', 
//             contentType: 'application/json',  
//             headers:{
//               'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJyb2xlX2lkIjoyLCJKd3RleHBpcmVzSW5TZWNvbmRzIjo5MDAwMCwiaWF0IjoxNjIyMjAxMTYxLCJleHAiOjE2MjIyMDQ3NjF9.mvcCkpfL-e9lBgHd0_fISCAuriFtOmp-qIs7pecLTF4'
//           }, 
//             data: JSON.stringify({ 
                
//                     "amount": 500,
//                     "currency": "BDT",
//                     "intent": "authorization",
//                     "merchantInvoiceNumber": "Inv002",
//                     "merchantAssociationInfo":"MI05MID54RF09123456789",
//                     "domain_origin":1,
//                      "app_reference":"ASDFR3 ",
//                      "currency_conversion_rate":1,
//                      "payment_type":"bKash",
//                      "currencyCode":"050"
                     
//               }), 
//             success: function(data) { 
//                 console.log("Response",data)
//                 data=data.data
               
//                 console.log("Payment ID", data.paymentID)
//               if (data && data.paymentID != null) { 
//                 paymentID = data.paymentID; 
//                 bKash.create().onSuccess(data); //pass the whole response data in bKash.create().onSucess() method as a parameter 
//               } else { 
//                 bKash.create().onError(); 
//               } 
//             }, 
//             error: function() { 
//               bKash.create().onError(); 
//             } 
//           }); 
//         },
//         executeRequestOnAuthorization: function() { 
//           $.ajax({ 
//             //url: 'http://localhost:4008/b2b/paymentGateway/executebKashPayment',
//              url: 'https://booking247.com:4008/b2b/paymentGateway/executebKashPayment', 
//             type: 'POST', 
//             contentType: 'application/json',
//             headers:{
//               'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyLCJyb2xlX2lkIjoyLCJKd3RleHBpcmVzSW5TZWNvbmRzIjo5MDAwMCwiaWF0IjoxNjIyMjAxMTYxLCJleHAiOjE2MjIyMDQ3NjF9.mvcCkpfL-e9lBgHd0_fISCAuriFtOmp-qIs7pecLTF4'},
//             data: JSON.stringify({ 
//               "paymentID": paymentID,
//               "domain_origin":1,
//               "app_reference":"ASDFR3",
//               "currency_conversion_rate":1  
//             }), 
//             success: function(data) { 
//               data = data;
//               console.log("Data",data)
//               if (data && data.paymentID != null) {
//                     console.log(data) 
//                 window.location.href = "";//Merchant’s success page 
//               } else { 
//                 bKash.execute().onError(); 
//               } 
//             }, 
//             error: function() { 
//               bKash.execute().onError(); 
//             } 
//           }); 
//         } ,
        
//       });
//     })
// }

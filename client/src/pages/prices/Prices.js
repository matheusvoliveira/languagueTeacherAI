import React, { useEffect, useState } from "react";
import firebase from "../../firebase/firebaseConfig";
import "./Prices.css";

const data = [
  {
    id: 1,
    title: "monthly",
    price: 29.99,
  },
  {
    id: 2,
    title: "quarterly",
    price: 79.99,
  },
];

const Home = () => {
  const [userId, setUserId] = useState("");
  const [userName, setUserName] = useState("");
  const [planType, setPlanType] = useState("");

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUserId(user.uid);
        setUserName(user.displayName || ""); // Adicionando um valor padrão caso displayName seja null
        const userRef = firebase.database().ref("users/" + user.uid);
        userRef.on("value", (snapshot) => {
          const user = snapshot.val();
          if (user) {
            setPlanType(user.subscription?.planType || ""); // Usando optional chaining para evitar erros
          }
        });
      } else {
        setUserId("");
        setUserName("");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const checkout = (plan) => {
    fetch("http://localhost:3001/api/v1/create-subscription-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ plan: plan, customerId: userId }),
    })
      .then((res) => {
        if (res.ok) return res.json();
        return res.json().then((json) => Promise.reject(json));
      })
      .then(({ session }) => {
        if (session && session.url) {
          window.location.href = session.url;
        } else {
          throw new Error("Invalid session response");
        }
      })
      .catch((error) => {
        console.error("Checkout error:", error);
      });
  };

  return (
    <div className="flex flex-col items-center w-full mx-auto min-h-screen diagonal-background overflow-x-hidden">
      <div className="flex justify-between items-center w-full px-6 h-20 bg-[#00000012]">
        <div className="text-4xl font-bold text-white">serVices</div>
        <div className="flex justify-center items-center gap-2">
          {!userId ? (
            <a
              href="/login"
              className="bg-white px-4 py-2 uppercase w-auto rounded-lg text-xl text-[#4f7cff] font-semibold"
            >
              Login
            </a>
          ) : (
            <div className="flex justify-center items-center space-x-4">
              <span className="text-white text-xl">{userName}</span>
              <button
                onClick={() => firebase.auth().signOut()}
                className="bg-white px-4 py-2 w-auto rounded-lg text-base uppercase font-semibold text-[#4f7cff]"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-5 z-50 place-items-center w-9/12 mx-auto mt-20">
        {data.map((item, idx) => (
          <div
            key={idx}
            className={`bg-white px-6 py-8 rounded-xl text-[#4f7cff] w-full mx-auto grid place-items-center ${
              planType === item.title.toLowerCase() &&
              "border-[16px] border-green-400"
            }`}
          >
            <div className="text-4xl text-slate-700 text-center py-4 font-bold">
              {item.title}
            </div>
            <p className="lg:text-sm text-xs text-center px-6 text-slate-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Dignissimos quaerat dolore sit eum quas non mollitia reprehenderit
              repudiandae debitis tenetur?
            </p>
            <div className="text-4xl text-center font-bold py-4">
              R${item.price}
            </div>
            <div className="mx-auto flex justify-center items-center my-3">
              {planType === item.title.toLowerCase() ? (
                <button className="bg-green-600 text-white rounded-md text-base uppercase w-auto py-2 px-4 font-bold">
                  Subscribed
                </button>
              ) : (
                <button
                  onClick={() => checkout(item.price)}
                  className="bg-[#3d5fc4] text-white rounded-md text-base uppercase w-24 py-2 font-bold"
                >
                  Start
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>

  //   <div class="pricing-table">
  //   <div class="pricing-card">

  //   <h3 class="pricing-card-header">TRIMESTRAL</h3>
  //     <div class="price"><sup>R$</sup>79.99<span>/3 MESES</span></div>
  //     <ul>
  //     <li> <strong>CHAT EM TEMPO REAL</strong></li>
  //       <li> <strong>TROCA DE AUDIOS</strong></li>
  //       <li> <strong>SUPORTE 24 HORAS</strong></li>
  //       <li> <strong>ACESSO ILIMITADO POR 1 ANO</strong></li>
  //       <li className="promo"> <strong>ECONOMIA DE R$10</strong></li>
  
  //     </ul>

      
  //     <a href="#" class="order-btn"  >Order Now</a>
  //   </div>
  
  //   <div class="pricing-card">
  //     <h3 class="pricing-card-header">ANUAL</h3>
  //     <div class="price"><sup>R$</sup>299.99<span>/ANO</span></div>
  //     <ul>
  //       <li> <strong>CHAT EM TEMPO REAL</strong></li>
  //       <li> <strong>TROCA DE AUDIOS</strong></li>
  //       <li> <strong>SUPORTE 24 HORAS</strong></li>
  //       <li> <strong>ACESSO ILIMITADO POR 1 ANO</strong></li>
  //       <li className="promo"> <strong>ECONOMIA DE R$60</strong></li>
  
  //     </ul>
  //     <a href="#" class="order-btn">Order Now</a>
  //   </div>
  
  //   <div class="pricing-card">
  //     <h3 class="pricing-card-header">MENSAL</h3>
  //     <div class="price"><sup>R$</sup>29.99<span>/MÊS</span></div>
  //     <ul>
  //     <li> <strong>CHAT EM TEMPO REAL</strong></li>
  //       <li> <strong>TROCA DE AUDIOS</strong></li>
  //       <li> <strong>SUPORTE 24 HORAS</strong></li>
  //       <li> <strong>ACESSO ILIMITADO POR 1 ANO</strong></li>
  
  //     </ul>
  //     <a href="#" class="order-btn" >Order Now</a>
  //   </div>
  
  // </div>
  );
};

export default Home;

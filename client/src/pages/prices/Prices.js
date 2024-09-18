import React, { useEffect, useState } from "react";
import firebase from "../../firebase/firebaseConfig";
import "./Prices.css";
import axios from "axios"

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


  const checkout = async (plan) => {
    try {
      const response = await fetch('http://147.79.107.2/api/v1/create-subscription-checkout-session', {
        plan: plan,
        customerId: userId
      });
  
      // Handle response data
      const { session } = response.data;
      if (session && session.url) {
        window.location.href = session.url;
      } else {
        throw new Error("Invalid session response");
      }
    } catch (error) {
      // Handle error
      console.error("Checkout error:", error.response?.data || error.message || 'An unknown error occurred');
    }
  };
  return (
    <div className="pricing-table">
      <div className="pricing-card">
        <h3 className="pricing-card-header">TRIMESTRAL</h3>
        <div className="price">
          <sup>R$</sup>79.99<span>/3 MESES</span>
        </div>
        <ul>
          <li>
            <strong>CHAT EM TEMPO REAL</strong>
          </li>
          <li>
            <strong>TROCA DE ÁUDIOS</strong>
          </li>
          <li>
            <strong>SUPORTE 24 HORAS</strong>
          </li>
          <li>
            <strong>ACESSO ILIMITADO POR 1 ANO</strong>
          </li>
          <li className="promo">
            <strong>ECONOMIA DE R$10</strong>
          </li>
        </ul>
        <div className="mx-auto flex justify-center items-center my-3">
          {planType === "quarterly" ? (
            <button className="bg-green-600 text-white rounded-md text-base uppercase w-auto py-2 px-4 font-bold">
              Subscribed
            </button>
          ) : (
            <button onClick={() => checkout(79.99)} className="order-btn">
              QUERO APRENDER INGLÊS
            </button>
          )}
        </div>
      </div>

      <div className="pricing-card">
        <h3 className="pricing-card-header">ANUAL</h3>
        <div className="price">
          <sup>R$</sup>299.99<span>/ANO</span>
        </div>
        <ul>
          <li>
            <strong>CHAT EM TEMPO REAL</strong>
          </li>
          <li>
            <strong>TROCA DE ÁUDIOS</strong>
          </li>
          <li>
            <strong>SUPORTE 24 HORAS</strong>
          </li>
          <li>
            <strong>ACESSO ILIMITADO POR 1 ANO</strong>
          </li>
          <li className="promo">
            <strong>ECONOMIA DE R$60</strong>
          </li>
        </ul>
        <a href="#" className="order-btn">
          QUERO APRENDER INGLÊS
        </a>
      </div>

      <div className="pricing-card">
        <h3 className="pricing-card-header">MENSAL</h3>
        <div className="price">
          <sup>R$</sup>29.99<span>/MÊS</span>
        </div>
        <ul style={{ marginBottom: "37px" }}>
          <li>
            <strong>CHAT EM TEMPO REAL</strong>
          </li>
          <li>
            <strong>TROCA DE ÁUDIOS</strong>
          </li>
          <li>
            <strong>SUPORTE 24 HORAS</strong>
          </li>
          <li>
            <strong>ACESSO ILIMITADO POR 1 ANO</strong>
          </li>
        </ul>
        <div className="mx-auto flex justify-center items-center my-3">
          {planType === "monthly" ? (
            <button className="bg-green-600 text-white rounded-md text-base uppercase w-auto py-2 px-4 font-bold">
              Subscribed
            </button>
          ) : (
            <button onClick={() => checkout(29.99)} className="order-btn">
              QUERO APRENDER INGLÊS
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

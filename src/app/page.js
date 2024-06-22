"use client";
import Footer from "@/components/Footer";
import { Connect } from "@/services/Web3Service";
import Head from "next/head";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaDonate, FaPlus, FaSignOutAlt, FaWallet } from "react-icons/fa";

export default function Home() {
  const [wallet, setWallet] = useState("");
  const [error, setError] = useState("");

  function buttonConnect() {
    Connect()
      .then((wallet) => {
        setWallet(wallet);
        localStorage.setItem("wallet", wallet);
      })
      .catch((err) => setError(err.message));
  }

  return (
    <>
      <Head>
        <title>Backaid | Home</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.ico" />
      </Head>

      <div className="container my-5">
        <div className="row justify-content-between align-items-center">
          <div className="col-md-6 order-md-2 d-flex justify-content-center align-items-center text-center">
            <img src="/image-insp.png" alt="Charity" className="img-fluid" />
          </div>

          <div className="col-md-6 text-center text-md-start">
            <img src="logo.png" className="img-fluid" />
            <p className="lead mb-4"></p>
            <p>
              Welcome to Backaid, where kindness meets action and hope is more
              than a promise—it's a reality we create together. At Backaid, we
              believe that every act of generosity, no matter how small, has the
              power to ignite change and transform lives. Our mission is to
              unite compassionate individuals with a common goal: to provide
              support, hope, and opportunities for those who need it most.
            </p>
            {!wallet ? (
              <button
                type="button"
                className="btn btn-primary btn-lg d-flex align-items-center justify-content-center"
                onClick={buttonConnect}
              >
                <FaWallet className="me-2" />
                CONNECT WALLET
              </button>
            ) : (
              <div>
                <p className="fw-bold">
                  Welcome back! {wallet.slice(0, 6)}...{wallet.slice(-4)}
                </p>
                <div className="d-flex flex-column align-items-center">
                  <Link
                    href="/donate"
                    className="btn btn-outline-primary mb-2 w-100 d-flex align-items-center justify-content-center"
                  >
                    <FaDonate className="me-2" />
                    Donate
                  </Link>
                  <Link
                    href="/create"
                    className="btn btn-outline-warning mb-2 w-100 d-flex align-items-center justify-content-center"
                  >
                    <FaPlus className="me-2" />
                    Create new campaign
                  </Link>
                  <Link
                    href="/withdraw"
                    className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center"
                  >
                    <FaSignOutAlt className="me-2" />
                    Close campaign
                  </Link>
                </div>
              </div>
            )}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

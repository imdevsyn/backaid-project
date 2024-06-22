"use client";
import Head from "next/head";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";
import {
  getCampaign,
  getActiveCampaigns,
  donate,
} from "@/services/Web3Service";
import { FaSearch, FaDonate } from "react-icons/fa";

export default function Donate() {
  const [campaign, setCampaign] = useState({});
  const [activeCampaigns, setActiveCampaigns] = useState([]);
  const [donation, setDonation] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Busca campanhas ativas na montagem do componente
    async function fetchActiveCampaigns() {
      try {
        const campaigns = await getActiveCampaigns();
        setActiveCampaigns(campaigns);
      } catch (err) {
        setMessage(
          `Error while searching for active campaigns: ${err.message}`
        );
      }
    }

    fetchActiveCampaigns();
  }, []);

  function onChangeId(evt) {
    setCampaign((prev) => ({ ...prev, id: evt.target.value }));
  }

  function btnSearchClick() {
    setMessage("Waiting for confirmation...");
    getCampaign(campaign.id)
      .then((result) => {
        setMessage("");
        result.id = campaign.id;
        setCampaign(result);
      })
      .catch((err) =>
        setMessage(`Error while searching campaign: ${err.message}`)
      );
  }

  function onChangeValue(evt) {
    setDonation(evt.target.value);
  }

  function btnDonateClick() {
    setMessage("Waiting for confirmation...");
    donate(campaign.id, donation)
      .then(() => setMessage("Donation complete! Thank you!"))
      .catch((err) => setMessage(`Erro ao doar: ${err.message}`));
  }

  function selectCampaign(campaign) {
    setCampaign(campaign);
  }

  return (
    <>
      <Head>
        <title>Backaid | Donate</title>
        <meta charSet="utf-8" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <div className="container">
        <div className="text-center mt-5 mb-5">
          <img src="backaid.png" width="350" />
          <p className="lead fs-10">
            Make a difference today, support a campaign!
          </p>
        </div>

        <div className="row">
          <div className="col-md-6">
            <p className="mb-4">
              What is the ID of the campaign you wish to donate to?
            </p>
            <div className="input-group mb-3">
              <input
                type="number"
                id="campaignId"
                className="form-control"
                onChange={onChangeId}
                value={campaign.id || ""}
                placeholder="Campaign ID"
              />
              <button className="btn btn-custom" onClick={btnSearchClick}>
                <FaSearch /> Search
              </button>
            </div>
          </div>
        </div>

        {!campaign.id ? (
          <>
            <h3 className="mb-4">Active Campaigns</h3>
            {activeCampaigns.length > 0 ? (
              <ul className="list-group">
                {activeCampaigns.map((campaign) => (
                  <li
                    key={campaign.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h5>{campaign.title}</h5>
                      <p>Goal: {Number(campaign.target) / 10 ** 18} ETH</p>
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={() => selectCampaign(campaign)}
                    >
                      Donate
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>There are no active campaigns.</p>
            )}
          </>
        ) : (
          <>
            <p>
              Please verify that this is the correct campaign before completing
              your donation.
            </p>
            <hr />
            <div className="row align-items-center">
              <div className="col-lg-7">
                {campaign.videoUrl ? (
                  <iframe
                    width="100%"
                    height="360"
                    src={campaign.videoUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <img
                    src={campaign.imageUrl}
                    className="img-fluid shadow-sm"
                    alt="Campaign Visual"
                  />
                )}
              </div>
              <div className="col-lg-5 mt-3 mt-lg-0">
                <h2 className="fw-bold">{campaign.title}</h2>
                <p>
                  <strong>Author:</strong> {campaign.author}
                </p>
                <p>
                  <strong>Goal:</strong> {Number(campaign.target) / 10 ** 18}{" "}
                  ETH
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {campaign.active ? (
                    <span>ACTIVE</span>
                  ) : (
                    <span>COMPLETE</span>
                  )}
                </p>
                <p>{campaign.description}</p>
                {campaign.videoUrl && (
                  <p className="fst-italic">
                    Watch the video on the side to learn more about this
                    campaign.
                  </p>
                )}
                <div className="alert alert-info mt-4">
                  <p>
                    What do you think of the project? So far,{" "}
                    <strong>{Number(campaign.balance) / 10 ** 18} ETH</strong>{" "}
                    has been raised for this campaign. How much would you like
                    to donate?
                  </p>
                </div>
                {campaign.goalReached ? (
                  <div className="alert alert-success">
                    <p>Goal achieved! Thank you so much! 😊</p>
                  </div>
                ) : campaign.active ? (
                  <div className="input-group mt-4">
                    <input
                      type="number"
                      id="donation"
                      className="form-control"
                      onChange={onChangeValue}
                      value={donation}
                      placeholder="Valor da Doação"
                    />
                    <span className="input-group-text">ETH</span>
                    <button className="btn btn-custom" onClick={btnDonateClick}>
                      <FaDonate /> Donate
                    </button>
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    <p>
                      This campaign has ended and can no longer accept
                      donations.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
        {message && (
          <div className="alert alert-custom alert-success mt-4">{message}</div>
        )}
        <Footer />
      </div>
    </>
  );
}

"use client";
import Head from "next/head";

import Footer from "@/components/Footer";
import { useState } from "react";
import { getCampaign, withdraw } from "@/services/Web3Service";

export default function Withdraw() {
  const [campaignId, setCampaignId] = useState("");
  const [campaign, setCampaign] = useState(null);
  const [message, setMessage] = useState("");

  campaignId = campaignId - 1;

  function btnSearchClick() {
    setMessage("Searching...");

    getCampaign(campaignId)
      .then((result) => {
        setMessage("");
        setCampaign(result);
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.message);
      });
  }

  function btnWithdrawClick() {
    setMessage("Waiting for confirmation...");

    withdraw(campaignId)
      .then((tx) => {
        setMessage(
          `Withdrawal successfully completed for campaign ID ${campaignId}`
        );
        return getCampaign(campaignId);
      })
      .then((updatedCampaign) => {
        setCampaign(updatedCampaign);
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.message);
      });
  }

  function onChangeId(evt) {
    setCampaignId(evt.target.value);
  }

  function formatBalance(balance) {
    return Number(balance) / 10 ** 18;
  }

  function CampaignDetails() {
    return (
      <div className="mt-4">
        <h4>Campaign Details</h4>
        <table className="table table-bordered">
          <tbody>
            <tr>
              <th scope="row">ID</th>
              <td>{campaign.id}</td>
            </tr>
            <tr>
              <th scope="row">Title</th>
              <td>{campaign.title}</td>
            </tr>
            <tr>
              <th scope="row">Description</th>
              <td>{campaign.description}</td>
            </tr>
            <tr>
              <th scope="row">Image URL</th>
              <td>{campaign.imageUrl}</td>
            </tr>
            <tr>
              <th scope="row">Video URL</th>
              <td>{campaign.videoUrl}</td>
            </tr>
            <tr>
              <th scope="row">Goal</th>
              <td>{formatBalance(campaign.target)} ETH</td>
            </tr>
            <tr>
              <th scope="row">Balance</th>
              <td>{formatBalance(campaign.balance)} ETH</td>
            </tr>
            <tr>
              <th scope="row">Status</th>
              <td>{campaign.active ? "ACTIVE" : "COMPLETE"}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Backaid | Withdraw Campaign Funds</title>
        <meta charSet="utf-8" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.ico" />
      </Head>

      <div className="container mt-5">
        <img src="backaid.png" width="300" />
        <p>Withdrawal Funds</p>
        <hr />

        <div className="mb-3">
          <label htmlFor="campaignId" className="form-label">
            Campaign ID
          </label>
          <input
            type="text"
            className="form-control"
            id="campaignId"
            value={campaignId}
            onChange={onChangeId}
            required
          />
        </div>

        <div className="mb-3">
          <button
            type="button"
            className="btn btn-primary me-3"
            onClick={btnSearchClick}
          >
            Search Campaign
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={btnWithdrawClick}
          >
            Withdraw Funds
          </button>
        </div>
        {campaign && <CampaignDetails />}
        {message && <div className="alert alert-info mt-3">{message}</div>}
        <Footer />
      </div>
    </>
  );
}

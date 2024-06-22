"use client";
import Head from "next/head";
import Link from "next/link";
import Footer from "@/components/Footer";
import { useState } from "react";
import { addCampaign, getLastCampaignId } from "@/services/Web3Service";
import { FaArrowLeft, FaSave } from "react-icons/fa";

export default function Create() {
  const [campaign, setCampaign] = useState({});
  const [message, setMessage] = useState("");

  function onInputChange(evt) {
    setCampaign((prevState) => ({
      ...prevState,
      [evt.target.id]: evt.target.value,
    }));
  }

  function btnSaveClick() {
    setMessage("Waiting for confirmation...");
    addCampaign(campaign)
      .then((tx) => getLastCampaignId())
      .then((id) =>
        setMessage(
          `Campaign ID ${id}.\n
          REMINDER: You can only create one campaign at a time.`
        )
      )
      .catch((err) => {
        console.error(err);
        setMessage(err.message);
      });
  }

  return (
    <>
      <Head>
        <title>Backaid | Create Campaign</title>
        <meta charSet="utf-8" />
        <meta name="description" content="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="card mt-5 shadow">
              <div className="card-body">
                <h1 className="card-title text-center fw-bold mb-4">
                  Create Campaign
                </h1>
                <p className="text-center text-muted mb-4">
                  Fill in the fields below to add your campaign.
                </p>
                <hr className="mb-4" />
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="title"
                    className="form-control"
                    placeholder="Campaign title"
                    value={campaign.title}
                    onChange={onInputChange}
                  />
                  <label htmlFor="title">Title*</label>
                </div>

                <div className="form-floating mb-3">
                  <textarea
                    id="description"
                    className="form-control"
                    placeholder="Campaign description"
                    value={campaign.description}
                    onChange={onInputChange}
                    style={{ height: "150px" }}
                  />
                  <label htmlFor="description">Description*</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="imageUrl"
                    className="form-control"
                    placeholder="Image URL"
                    value={campaign.imageUrl}
                    onChange={onInputChange}
                  />
                  <label htmlFor="imageUrl">Image URL*</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    id="videoUrl"
                    className="form-control"
                    placeholder="Video URL"
                    value={campaign.videoUrl}
                    onChange={onInputChange}
                  />
                  <label htmlFor="videoUrl">Video URL (embed)*</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="number"
                    id="target"
                    className="form-control"
                    placeholder="Donation goal"
                    value={campaign.target}
                    onChange={onInputChange}
                  />
                  <label htmlFor="target">Goal (ETH)*</label>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={btnSaveClick}
                  >
                    <FaSave className="me-2" />
                    Save Campaign
                  </button>
                  <Link href="/" className="btn btn-secondary btn-lg">
                    <FaArrowLeft className="me-2" />
                    Back
                  </Link>
                </div>

                {message && (
                  <div className="alert alert-success mt-4" role="alert">
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

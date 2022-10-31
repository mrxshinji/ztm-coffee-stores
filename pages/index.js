import Head from "next/head";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";

import Card from "../components/card";
import Banner from "../components/banner";

import styles from "../styles/Home.module.css";

import { fetchCoffeeStores } from "../lib/coffee-stores-data";

import { useTrackLocation } from "../utils/use-track-location";
import { ACTION_TYPES, StoreContext } from "./_app";

export async function getStaticProps(context) {
  const coffeeStoresData = await fetchCoffeeStores();
  return {
    props: {
      coffeeStoresData,
    }, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const {
    handleTrackLocation,
    locationErrorMsg,
    isFindingLocation,
  } = useTrackLocation();

  const [errorFetchedStores, setErrorFetchedStores] = useState("");

  const {state, dispatch} = useContext(StoreContext);
  const {coffeeStores, latLong} = state;

  useEffect(() => {
    async function getStores() {
      if (latLong) {
        try {
          const fetchData = await fetch(`/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`)
          const coffeeStores = await fetchData.json();
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: {
              coffeeStores: coffeeStores,
            },
          });
          setErrorFetchedStores('')
        } catch (err) {
          setErrorFetchedStores(err.message);
          
        }
      }
    }
    getStores();
    
  }, [latLong, dispatch]);

  const handleOnBannerBtnClick = () => {
    handleTrackLocation();
  };

  // loading ....
  if (!props.coffeeStoresData) {
    return <div>Loading...</div>;
  }
  
  // return Home
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Conneisour</title>
        <meta name='description' content='Discover coffee stores near you here ~' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Loading" : "View Stores Nearby"}
          bannerHandleClick={handleOnBannerBtnClick}
        />

        {/* error */}
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        {errorFetchedStores && (
          <p>Something went wrong: {errorFetchedStores}</p>
        )}

        <div className={styles.heroImage}>
          <Image
            src={"/static/hero-image.png"}
            width={700}
            height={400}
            alt='hero image'
          />
        </div>
        {coffeeStores.length > 0 && (
          <>
            <h2 className={styles.heading2}>Stores Near Me </h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </>
        )}
        {props.coffeeStoresData.length > 0 && (
          <>
            <h2 className={styles.heading2}>Mont Kiara Stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStoresData.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                    className={styles.card}
                  />
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

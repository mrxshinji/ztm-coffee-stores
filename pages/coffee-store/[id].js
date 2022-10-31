import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import Image from "next/image";

import cls from "classnames";

import { fetchCoffeeStores } from "../../lib/coffee-stores-data";

import styles from "../../styles/coffee-store.module.css";
import { useContext, useState, useEffect } from "react";
import { StoreContext } from "../_app";

import { isEmpty } from "../../utils/isEmpty";

import useSWR from "swr";
import { fetcher } from "../../lib/swr";

// get static props
export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  const coffeeStores = await fetchCoffeeStores();
  const coffeStoreFromContext = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id.toString() === params.id; //dynamic id
  });
  return {
    props: {
      coffeeStore: coffeStoreFromContext ? coffeStoreFromContext : {},
    },
  };
}

// get static paths
export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();
  const paths = coffeeStores.map((store) => {
    return {
      params: {
        id: store.id.toString(),
      },
    };
  });

  return {
    paths,
    fallback: true,
  };
}

//coffeestore
export const CoffeeStore = (initialProps) => {
  const router = useRouter();

  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.coffeeStore || {}
  );

  const {
    state: { coffeeStores },
  } = useContext(StoreContext);
  const routerId = router.query.id;

  // fetch data from self api or create data from self api
  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { id, name, imgUrl, address, neighbourhood } = coffeeStore;

      const response = await fetch("/api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          voting: 0,
          imgUrl,
          neighbourhood: neighbourhood || "",
          address: address || "",
        }),
      });

      const dbCoffeeStore = await response.json();
    } catch (err) {
      console.error("Error creating coffee store", err);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id.toString() === routerId; //dynamic id
        });
        if (coffeStoreFromContext) {
          setCoffeeStore(coffeStoreFromContext);
          handleCreateCoffeeStore(coffeStoreFromContext);
        }
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [routerId, coffeeStores, initialProps]);


  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${routerId}`, fetcher);

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    }
  }, [data]);

  const [votingCount, setVotingCount] = useState(coffeeStore.voting || 0);
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const { name = "", address = "", neighbourhood = "", imgUrl = "" } = coffeeStore;
  
  const handleUpvoteButton = async () => {
    try {
      const response = await fetch("/api/upvoteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: routerId,
        }),
      });

      const updateStore = await response.json();
      if(updateStore && updateStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.error("Error upvoting store in [id]", err);
    }

  };

  if (error) {
    console.error(error);
    return <div> Something went wrong with retrieve store by id </div>;
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href='/'>
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src='/static/icons/places.svg'
              width='24'
              height='24'
              alt='places icon'
            />
            <p className={styles.text}>{address}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src='/static/icons/nearMe.svg'
              width='24'
              height='24'
              alt='near me icion'
            />
            <p className={styles.text}>
              {neighbourhood && neighbourhood[0]}
            </p>
          </div>
          <div className={styles.iconWrapper}>
            <Image
              src='/static/icons/star.svg'
              width='24'
              height='24'
              alt='star icon'
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;

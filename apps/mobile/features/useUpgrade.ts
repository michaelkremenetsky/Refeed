import { useEffect, useState } from "react";
import { Alert } from "react-native";
import type { PurchasesPackage } from "react-native-purchases";
import Purchases from "react-native-purchases";

export const useUpgrade = () => {
  // Payments are disabled on mobile for now
  // const purchaseSubscriptionOption = (option: SubscriptionOption) => {
  //   Purchases.purchaseSubscriptionOption(option)
  //     .then((result) => {})
  //     .catch((err) => {
  //       // console.log("error", err);
  //     });
  // };a

  const [packages, setPackages] = useState<PurchasesPackage>();

  useEffect(() => {
    // Get current available packages
    const getPackages = async () => {
      try {
        const offerings = await Purchases.getOfferings();
        if (
          offerings.current !== null &&
          offerings.current.availablePackages.length !== 0
        ) {
          setPackages(offerings.current.monthly!);
        }
      } catch (e) {
        if (e instanceof Error) {
          Alert.alert("Error getting offers", e.message);
        }
      }
    };

    getPackages();
  }, []);

  return { packages };
};

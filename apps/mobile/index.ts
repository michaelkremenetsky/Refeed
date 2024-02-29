import "@expo/metro-runtime";

import { registerRootComponent } from "expo";

import "fast-text-encoding";
import "react-native-gesture-handler";
import "react-native-get-random-values";

import { enableFreeze } from "react-native-screens";

import { Start } from "./Navigation";

enableFreeze(true);

registerRootComponent(Start);

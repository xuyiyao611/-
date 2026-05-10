import popsicle from "@/assets/sumikko/popsicle.png";
import pudding from "@/assets/sumikko/pudding.png";
import soda from "@/assets/sumikko/soda.png";
import { foodLabels, foodPrices } from "@/shared/config/collectionRules";
import type { FoodType } from "@/shared/types/app";

export const foodVisuals: Record<
  FoodType,
  {
    image: string;
    label: string;
    price: number;
  }
> = {
  pudding: {
    image: pudding,
    label: foodLabels.pudding,
    price: foodPrices.pudding,
  },
  soda: {
    image: soda,
    label: foodLabels.soda,
    price: foodPrices.soda,
  },
  popsicle: {
    image: popsicle,
    label: foodLabels.popsicle,
    price: foodPrices.popsicle,
  },
};

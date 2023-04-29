import * as React from "react";

export type StoreCtxT = {
  tags: string[];
  whatsnew: { title: string; description: string }[] | null;
};
const StoreCtx = React.createContext<StoreCtxT>({
  whatsnew: null,
  tags: ["SEO"],
});

export const StoreCtxProv = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: StoreCtxT;
}) => <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;

export const useStoreCtx = () => React.useContext(StoreCtx);

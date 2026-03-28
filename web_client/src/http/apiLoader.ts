"use client";

type Subscriber = (count: number) => void;

let pendingGetRequests = 0;
const subscribers = new Set<Subscriber>();

const emit = () => {
  subscribers.forEach((subscriber) => subscriber(pendingGetRequests));
};

export const subscribeApiLoader = (subscriber: Subscriber) => {
  subscribers.add(subscriber);
  subscriber(pendingGetRequests);
  return () => {
    subscribers.delete(subscriber);
  };
};

export const incrementGetRequest = () => {
  pendingGetRequests += 1;
  emit();
};

export const decrementGetRequest = () => {
  if (pendingGetRequests <= 0) return;
  pendingGetRequests -= 1;
  emit();
};

export const resetApiLoader = () => {
  pendingGetRequests = 0;
  emit();
};

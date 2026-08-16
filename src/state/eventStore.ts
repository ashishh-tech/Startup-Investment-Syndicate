import { create } from "zustand";
import { BlockchainEvent } from "@/types";

export interface EventState {
  events: BlockchainEvent[];
  isStreaming: boolean;
  filterType: string;
  filterSyndicate: string;

  // Actions
  addEvent: (event: BlockchainEvent) => void;
  setEvents: (events: BlockchainEvent[]) => void;
  setFilterType: (filter: string) => void;
  setFilterSyndicate: (syndicate: string) => void;
  setStreaming: (streaming: boolean) => void;
  clearEvents: () => void;
}

const INITIAL_EVENTS: BlockchainEvent[] = [
  {
    id: "evt-01",
    type: "deposit",
    timestamp: Date.now() - 1000 * 60 * 12,
    txHash: "8f74a9d9c22b2e987162983b4e4c278912384a6c8e312984b5c192847a9e8b12",
    syndicateId: "syn-01",
    syndicateName: "Aetheria AI Robotics",
    actor: "GBZXN7PIRZGNMHGA728JDO2Y27494B6GQLK3Y7O57NVX5L5Q2O3F36SY",
    actorLabel: "Apex Angel LP",
    amount: 150000,
    assetSymbol: "USDC",
    details: "Deposited 150,000 USDC into Seed Round vault (received 150,000 AETH-SYND tokens)",
  },
  {
    id: "evt-02",
    type: "tranche_released",
    timestamp: Date.now() - 1000 * 60 * 45,
    txHash: "4c278912384a6c8e312984b5c192847a9e8b128f74a9d9c22b2e987162983b",
    syndicateId: "syn-01",
    syndicateName: "Aetheria AI Robotics",
    actor: "GDL36B6U4XP3E2N7J5Q2B3P74Y49B6GQLK3Y7O57NVX5L5Q2O3F36SY",
    actorLabel: "Syndicate Lead",
    amount: 250000,
    assetSymbol: "USDC",
    details: "Released Milestone 1 Tranche (Hardware Prototype Complete) to founder address",
  },
  {
    id: "evt-03",
    type: "milestone_approved",
    timestamp: Date.now() - 1000 * 60 * 120,
    txHash: "92847a9e8b128f74a9d9c22b2e987162983b4e4c278912384a6c8e312984b5c1",
    syndicateId: "syn-01",
    syndicateName: "Aetheria AI Robotics",
    actor: "GDL36B6U4XP3E2N7J5Q2B3P74Y49B6GQLK3Y7O57NVX5L5Q2O3F36SY",
    actorLabel: "Syndicate Lead",
    details: "Approved Milestone 1 Deliverables: Tested Sub-millimeter actuator motors",
  },
  {
    id: "evt-04",
    type: "deposit",
    timestamp: Date.now() - 1000 * 60 * 240,
    txHash: "12384a6c8e312984b5c192847a9e8b128f74a9d9c22b2e987162983b4e4c2789",
    syndicateId: "syn-02",
    syndicateName: "NeuroPulse MedTech",
    actor: "GCY36B6U4XP3E2N7J5Q2B3P74Y49B6GQLK3Y7O57NVX5L5Q2O3F36SY",
    actorLabel: "BioVentures LP",
    amount: 200000,
    assetSymbol: "USDC",
    details: "Deposited 200,000 USDC into Series A tranche pool",
  },
  {
    id: "evt-05",
    type: "exit_triggered",
    timestamp: Date.now() - 1000 * 60 * 600,
    txHash: "e312984b5c192847a9e8b128f74a9d9c22b2e987162983b4e4c278912384a6c8",
    syndicateId: "syn-03",
    syndicateName: "QuantumCipher Security",
    actor: "GDACQ5L2X6Y8Z12984b5c192847a9e8b128f74a9d9c22b2e987162983b4e4c2",
    actorLabel: "Acquiring Entity",
    amount: 5000000,
    assetSymbol: "USDC",
    details: "Acquisition exit executed at $5,000,000 proceeds (3.33x Return Waterfall activated)",
  },
  {
    id: "evt-06",
    type: "payout_claimed",
    timestamp: Date.now() - 1000 * 60 * 750,
    txHash: "b5c192847a9e8b128f74a9d9c22b2e987162983b4e4c278912384a6c8e312984",
    syndicateId: "syn-03",
    syndicateName: "QuantumCipher Security",
    actor: "GBZXN7PIRZGNMHGA728JDO2Y27494B6GQLK3Y7O57NVX5L5Q2O3F36SY",
    actorLabel: "Apex Angel LP",
    amount: 720000,
    assetSymbol: "USDC",
    details: "Claimed pro-rata LP return payout ($720,000 USDC on $250,000 initial principal)",
  },
];

export const useEventStore = create<EventState>((set) => ({
  events: INITIAL_EVENTS,
  isStreaming: true,
  filterType: "all",
  filterSyndicate: "all",

  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
  setEvents: (events) => set({ events }),
  setFilterType: (filterType) => set({ filterType }),
  setFilterSyndicate: (filterSyndicate) => set({ filterSyndicate }),
  setStreaming: (isStreaming) => set({ isStreaming }),
  clearEvents: () => set({ events: [] }),
}));

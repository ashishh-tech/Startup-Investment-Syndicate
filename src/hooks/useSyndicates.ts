import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SyndicateService } from "@/services/syndicateService";

export function useSyndicates() {
  return useQuery({
    queryKey: ["syndicates"],
    queryFn: () => SyndicateService.getAllSyndicates(),
    staleTime: 1000 * 30,
  });
}

export function useSyndicate(id: string) {
  return useQuery({
    queryKey: ["syndicate", id],
    queryFn: () => SyndicateService.getSyndicateById(id),
    enabled: !!id,
    staleTime: 1000 * 10,
  });
}

export function useDepositMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      syndicateId,
      investorAddress,
      amount,
    }: {
      syndicateId: string;
      investorAddress: string;
      amount: number;
    }) => SyndicateService.depositCapital(syndicateId, investorAddress, amount),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syndicates"] });
      queryClient.invalidateQueries({ queryKey: ["syndicate"] });
    },
  });
}

export function useMilestoneReleaseMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      syndicateId,
      milestoneId,
      callerAddress,
    }: {
      syndicateId: string;
      milestoneId: number;
      callerAddress: string;
    }) => SyndicateService.releaseTranche(syndicateId, milestoneId, callerAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syndicates"] });
      queryClient.invalidateQueries({ queryKey: ["syndicate"] });
    },
  });
}

export function useMilestoneApproveMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      syndicateId,
      milestoneId,
      approverAddress,
    }: {
      syndicateId: string;
      milestoneId: number;
      approverAddress: string;
    }) => SyndicateService.approveMilestone(syndicateId, milestoneId, approverAddress),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["syndicates"] });
      queryClient.invalidateQueries({ queryKey: ["syndicate"] });
    },
  });
}

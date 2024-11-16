import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { mintNFT } from "../lib/web3";
import { useToast } from "../hooks/use-toast";

interface NFTRewardProps {
  streamId: number;
  participantId: number;
  isEligible: boolean;
}

export function NFTReward({ streamId, participantId, isEligible }: NFTRewardProps) {
  const [isMinting, setIsMinting] = useState(false);
  const { toast } = useToast();

  async function handleMint() {
    try {
      setIsMinting(true);
      await mintNFT(streamId, participantId);
      toast({
        title: "Success",
        description: "Stream participation NFT has been minted!",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to mint NFT. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsMinting(false);
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="px-4 py-3 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Stream Participation NFT</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 sm:p-6 sm:pt-0">
        <div className="bg-gradient-to-r from-black/10 to-gray-500/10 p-4 sm:p-6 rounded-lg text-center">
          <img
            src="/nft-badge.svg"
            alt="NFT Badge"
            className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4"
          />
          <p className="text-sm sm:text-base text-muted-foreground">
            {isEligible
              ? "You're eligible to claim your participation NFT!"
              : "Watch the stream longer to become eligible"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="px-4 pb-4 sm:p-6">
        <Button
          className="w-full h-11 active:scale-95 transition-transform"
          onClick={handleMint}
          disabled={!isEligible || isMinting}
        >
          {isMinting ? "Minting..." : "Claim NFT"}
        </Button>
      </CardFooter>
    </Card>
  );
}

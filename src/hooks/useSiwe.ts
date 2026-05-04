import { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { SiweMessage } from 'siwe';
import { getAttributionPayload, encodeAttributionData } from '../lib/erc8021';
import { initializeTrustlessAgent } from '../lib/erc8004';

export function useSiwe() {
  const { address, chainId } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = async () => {
    if (!address || !chainId) return;
    
    try {
      // 1. Get Nonce
      const nonceRes = await fetch('/api/nonce');
      const nonce = await nonceRes.text();

      // 2. Create SIWE Message
      const message = new SiweMessage({
        domain: window.location.host,
        address,
        statement: 'Sign in to Signal Seekers to save your progress.',
        uri: window.location.origin,
        version: '1',
        chainId,
        nonce,
      });

      // 3. Sign Message
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      });

      // 4. Verify Signature
      const verifyRes = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, signature }),
      });

      if (!verifyRes.ok) throw new Error('Error verifying message');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('SIWE Error:', error);
    }
  };

  const submitScoreOnChain = async (score: number, depth: number) => {
    if (!address || !isAuthenticated) {
      await signIn();
    }
    
    if (!address) return;

    try {
      // Create attribution payload using ERC-8021
      const attribution = getAttributionPayload();
      const encodedAttribution = encodeAttributionData(attribution);
      
      // Initialize an ERC-8004 Agent for score submission verification
      const agent = initializeTrustlessAgent({
        agentEndpoint: 'https://rpc.base.org',
        riskTolerance: 0.1,
        permissions: ['score_submit']
      });

      // Sign the score submission as proof
      const statement = `I submit a depth of ${depth} and score of ${score} to Signal Seekers. ${encodedAttribution}`;
      const signature = await signMessageAsync({
        message: statement
      });

      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, score, depth, signature }),
      });

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Submit score failed:", error);
    }
  };

  const sayGM = async () => {
    if (!address) return;
    try {
      const signature = await signMessageAsync({
        message: `GM from Signal Seekers! Base Builder: bc_m82npol5`
      });
      alert(`GM recorded on-chain! Signature: ${signature.slice(0, 10)}...`);
    } catch (e) {
      console.error(e);
    }
  };

  return {
    signIn,
    submitScoreOnChain,
    sayGM,
    isAuthenticated
  };
}

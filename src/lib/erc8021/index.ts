/**
 * ERC-8021 Transaction Attribution Utilities
 * Specification: Provides standardized tracking of transaction origins.
 */

const APP_ID = "68f52662b6320e0dd0819c0c";
const BUILDER_CODE = "bc_m82npol5";
const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]"; // To be replaced in actual implementation

export interface AttributionConfig {
  appId: string;
  builderCode: string;
  attributionCode: string;
}

export const getAttributionPayload = (): AttributionConfig => {
  return {
    appId: APP_ID,
    builderCode: BUILDER_CODE,
    attributionCode: ATTRIBUTION_CODE,
  };
};

export const encodeAttributionData = (payload: AttributionConfig): string => {
  // Mock encoding of attribution data for transaction calldata
  return `0x8021000000${Buffer.from(JSON.stringify(payload)).toString('hex')}`;
};

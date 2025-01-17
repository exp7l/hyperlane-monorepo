import { expect } from 'chai';

import { ProtocolType } from '@hyperlane-xyz/utils';

import { chainMetadata } from '../consts/chainMetadata';

import { ChainMetadata, isValidChainMetadata } from './chainMetadataTypes';

const minimalSchema: ChainMetadata = {
  chainId: 5,
  domainId: 5,
  name: 'goerli',
  protocol: ProtocolType.Ethereum,
  rpcUrls: [{ http: 'https://foobar.com' }],
};

const blockExplorers = [
  {
    name: 'scan',
    url: 'https://foobar.com',
    apiUrl: 'https://api.foobar.com',
  },
];

const blocks = {
  confirmations: 1,
  estimateBlockTime: 10,
};

describe('ChainMetadataSchema', () => {
  it('Accepts valid schemas', () => {
    expect(isValidChainMetadata(minimalSchema)).to.eq(true);

    expect(
      isValidChainMetadata({
        ...minimalSchema,
        blockExplorers,
      }),
    ).to.eq(true);

    expect(
      isValidChainMetadata({
        ...minimalSchema,
        blockExplorers,
      }),
    ).to.eq(true);

    expect(
      isValidChainMetadata({
        ...minimalSchema,
        blockExplorers,
        blocks,
      }),
    ).to.eq(true);

    expect(
      isValidChainMetadata({
        ...minimalSchema,
        protocol: ProtocolType.Cosmos,
        chainId: 'cosmos',
        bech32Prefix: 'cosmos',
        slip44: 118,
      }),
    ).to.eq(true);
  });

  it('Rejects invalid schemas', () => {
    expect(
      //@ts-ignore
      isValidChainMetadata({}),
    ).to.eq(false);

    //@ts-ignore
    expect(isValidChainMetadata({ ...minimalSchema, chainId: 'id' })).to.eq(
      false,
    );

    expect(
      isValidChainMetadata({
        ...minimalSchema,
        blockExplorers: [
          {
            ...blockExplorers[0],
            apiUrl: 'not-a-url',
          },
        ],
      }),
    ).to.eq(false);

    expect(
      isValidChainMetadata({
        ...minimalSchema,
        name: 'Invalid name',
      }),
    ).to.eq(false);

    expect(
      isValidChainMetadata({
        ...minimalSchema,
        chainId: 'string-id',
      }),
    ).to.eq(false);

    expect(
      isValidChainMetadata({
        ...minimalSchema,
        protocol: ProtocolType.Cosmos,
        chainId: 'string-id',
      }),
    ).to.eq(false);
  });

  it('Works for all SDK chain metadata consts', () => {
    for (const chain of Object.keys(chainMetadata)) {
      const isValid = isValidChainMetadata(chainMetadata[chain]);
      // eslint-disable-next-line no-console
      if (!isValid) console.error(`Invalid chain metadata for ${chain}`);
      expect(isValid).to.eq(true);
    }
  });
});

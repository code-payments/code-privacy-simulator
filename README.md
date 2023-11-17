# Simulated Wallet App

This repository was originally used to test various configuration values against the [Code Sequencer](https://code-wallet.github.io/code-sdk/docs/reference/sequencer.html). The simulations are not longer actively used but may be useful as a reference. You should instead refer to the iOS codebase.

Additionally, the Code SDK was created from the work in this repository, and is now the recommended way to interact with the Code Sequencer from Node.js or the browser. See the [Code SDK](https://sdk.getcode.com). While the Code SDK is not a direct replacement for this repository, it does provide a more robust and stable way to interact with the Code Sequencer. We will continue to pull useful code from this repository into the Code SDK.

If there is something you need from this repository that is not in the Code SDK, please open an issue and we will consider adding it.

## Known Issues

The GRPC protocol has changed enough that some of the tests in this repository no longer work. The changes are not drastic but would require some thoughtful engineering. For example, the sequencer requires Apple Device Attestation, which is not easy to spoof without a real device.

The tests in this repository are not actively maintained and are not recommended for use in production. They are provided as a reference for those who are interested in how the Code Sequencer works.

## Quick Start

If you're undeterred by the known issues, here's how to get started.

To get started, make sure you have node installed on your system. Once you have that, simply run `npm install` from this directory.

To run the tests and simulations, simply run `npm run tests` or `npm run simulation` or `npm run examples` from the command line.

## Getting Help

If you have any questions or need help integrating Code into your website or application, please reach out to us on [Discord](https://discord.gg/T8Tpj8DBFp) or [Twitter](https://twitter.com/getcode).

##  Contributing

For now the best way to contribute is to share feedback on [Discord](https://discord.gg/T8Tpj8DBFp). This will evolve as we continue to build out the platform and open up more ways to contribute. 
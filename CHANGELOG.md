# Changelog

## [0.2.0](https://github.com/MonsieurBarti/visual-explainer-pi/compare/visual-explainer-pi-v0.1.1...visual-explainer-pi-v0.2.0) (2026-04-09)


### ⚠ BREAKING CHANGES

* any saved prompts, skills, or slash-command templates that hardcode the old tool id must be updated. Live LLM sessions pick up the new name automatically from the registered tool list.

### Code Refactoring

* namespace tool id as tff-generate_visual ([#3](https://github.com/MonsieurBarti/visual-explainer-pi/issues/3)) ([eea2b86](https://github.com/MonsieurBarti/visual-explainer-pi/commit/eea2b865d4a5f0b043817d5aa97ffc56774b3d23))

## [0.1.1](https://github.com/MonsieurBarti/visual-explainer-pi/compare/visual-explainer-pi-v0.1.0...visual-explainer-pi-v0.1.1) (2026-04-09)


### Features

* initial implementation of visual-explainer-pi extension ([7a31b95](https://github.com/MonsieurBarti/visual-explainer-pi/commit/7a31b95e2300c7084dae83576af52f1a992d4a04))


### Bug Fixes

* don't escape mermaid syntax - arrows need to be raw ([42002a3](https://github.com/MonsieurBarti/visual-explainer-pi/commit/42002a3e959853aad2022d1324ad416cfe27423e))

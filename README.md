# Changelog Notifier JavaScript Action

This action notifies you in Telegram when there is a new release.

## Inputs

### `prefixes`

Multiline input of convetional commits prefixes. Default `feat fix`.

### `TOKEN`

**Required** Telegram bot token.

### `CHAT_ID`

**Required** Telegram chat ID.

## Example usage

```yaml
uses: egorpariah/changelog-notifier@v1.1
with:
  prefixes: |-
    feat
    fix
  TOKEN: tg-bot-token
  CHAT_ID: tg-chat-id
```
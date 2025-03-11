# Changelog Notifier JavaScript Action

This action notifies you in Telegram when there is a new release.

## Inputs

### `prefixes`

Multiline input of convetional commits prefixes. Default `feat fix`.

### `token`

**Required** Telegram bot token.

### `chat_id`

**Required** Telegram chat ID.

### `commits`

JSON string from the github.event payload with an array of commits. If not provided, it is assumed that the commits are taken from the current workflow.

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
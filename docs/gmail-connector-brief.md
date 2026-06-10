# Gmail Connector Capability Brief

I have successfully connected to your active Gmail account (`chaddozier75@gmail.com`) and tested the capabilities of the Gmail MCP connector. Below is a comprehensive overview of what the connector can do, demonstrated with live data from your inbox.

## Core Capabilities

The Gmail MCP connector provides four primary tools to interact with your email:

1. **`gmail_search_messages`**: Search and list Gmail messages using standard Gmail search operators (e.g., `in:inbox`, `is:unread`, `from:someone@example.com`).
2. **`gmail_read_threads`**: Retrieve the full content of one or more email threads by their IDs, including the message bodies and attachment metadata.
3. **`gmail_manage_labels`**: List, get, create, update, delete, apply, or remove labels. This allows for automated organization of your inbox.
4. **`gmail_send_messages`**: Send new emails or save them as drafts. It supports attachments, CC, BCC, and replying to existing threads. (Note: Sending requires an interactive user confirmation in the UI before the message is actually sent).

---

## Live Data Demonstration

To demonstrate these capabilities, I ran a few tests on your inbox.

### 1. Label Management (`gmail_manage_labels`)
I queried the labels in your account. You have **97 labels** in total. Here is a snapshot of some of your custom labels used for organization:

| Label Name | Type | Visibility |
| :--- | :--- | :--- |
| **Business/Athlynx** | User | Show |
| **Business/Softmor** | User | Show |
| **Business/NIL Portal** | User | Show |
| **Archive/Personal** | User | Show |
| **AthlynX/Critical-Alerts** | User | Hide |
| **AthlynX/Connector-Watchdog** | User | Hide |

*This tool can be used to automatically categorize incoming emails or clean up your inbox by applying/removing these labels.*

### 2. Message Search (`gmail_search_messages`)
I performed a search for the most recent messages in your inbox. Here are the latest emails you received:

*   **New sign-in to your Shopify account**
    *   **From:** Shopify
    *   **Date:** Jun 6, 2026, 02:44 PM UTC
*   **You’re now selling in Microsoft Copilot**
    *   **From:** Shopify
    *   **Date:** Jun 6, 2026, 02:28 PM UTC
*   **[AthlynX] 7 AM Briefing · Saturday, June 6, 2026 · 0 meetings · 0 new signups**
    *   **From:** AthlynX
    *   **Date:** Jun 6, 2026, 12:01 PM UTC
*   **AthlynXAI — Final Investor Portfolio & Team Structure**
    *   **From:** Chad A Dozier
    *   **Date:** Jun 6, 2026, 08:51 AM UTC

*I also ran a query for `is:unread`, which successfully filtered the results to show only unread emails (like the Shopify sign-in alert).*

### 3. Reading Threads (`gmail_read_threads`)
I extracted the full thread for the "OFFICIAL: Athlynx AI Corporation Operating Agreement" email.

**Thread Summary:**
*   **Initial Email:** Sent by you to Leronious Marshall on Jun 6, 2026, at 01:24 AM UTC. It included the "Official Operating Agreement and Investment Portfolio Summary for Athlynx AI Corporation".
*   **Attachment Detected:** `Athlynx_AI_Official_Operating_Agreement.pdf` (The connector can detect and download attachments to my sandbox for further analysis).
*   **Reply:** Leronious replied at 02:04 AM UTC stating: *"Hi Chad Got the agreement and summary. I'll review the documents now. Leronious"*

---

## How We Can Use This Together

With this connector, you can ask me to perform tasks such as:

*   **Inbox Triage:** *"Find all unread emails from AthlynX and summarize them."*
*   **Automated Drafting:** *"Draft a reply to Leronious thanking him for reviewing the agreement, but save it as a draft."*
*   **Organization:** *"Find all emails containing receipts from Stripe and apply the 'Receipts/Stripe-PlanetScale' label to them."*
*   **Information Extraction:** *"Read the thread about the 'Final Investor Portfolio' and extract the key action items."*

Let me know if you'd like me to perform any specific actions on your inbox!

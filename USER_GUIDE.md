# ToolTrack — User Guide

**Version:** 1.0  
**App URL:** https://tooltracking.netlify.app  
**Last updated:** June 2026

---

## Table of Contents

1. [What is ToolTrack?](#1-what-is-tooltrack)
2. [Getting Started](#2-getting-started)
3. [Admin Guide](#3-admin-guide)
   - 3.1 [Admin Dashboard overview](#31-admin-dashboard-overview)
   - 3.2 [Managing tool inventory](#32-managing-tool-inventory)
   - 3.3 [Assigning tools to workers](#33-assigning-tools-to-workers)
   - 3.4 [Verifying and accepting returns](#34-verifying-and-accepting-returns)
   - 3.5 [Rejecting a return request](#35-rejecting-a-return-request)
   - 3.6 [Editing and deleting tools](#36-editing-and-deleting-tools)
4. [Worker Guide](#4-worker-guide)
   - 4.1 [Your dashboard](#41-your-dashboard)
   - 4.2 [Requesting a return](#42-requesting-a-return)
   - 4.3 [Understanding pending return status](#43-understanding-pending-return-status)
   - 4.4 [Browsing all tools](#44-browsing-all-tools)
5. [Tool Statuses Explained](#5-tool-statuses-explained)
6. [Return Verification Workflow](#6-return-verification-workflow)
7. [Tips and Best Practices](#7-tips-and-best-practices)
8. [Frequently Asked Questions](#8-frequently-asked-questions)
9. [Troubleshooting](#9-troubleshooting)

---

## 1. What is ToolTrack?

ToolTrack is a web-based tool inventory and assignment management system. It gives your organization a single place to:

- Know exactly which tools you own and how many are available
- Assign tools to workers and track who has what
- Verify physical returns before releasing a tool back into stock
- Prevent "fake returns" — tools can only be marked available after an admin physically checks them in

**Two roles exist:**

| Role | What they can do |
|---|---|
| **Admin** | Full control: add, edit, delete, assign, verify returns, manage inventory |
| **Worker** | View their assigned tools, request a return, browse the full catalogue |

---

## 2. Getting Started

### 2.1 Creating an account

1. Visit [tooltracking.netlify.app](https://tooltracking.netlify.app)
2. Click **Get Started** or **Sign In** in the top navigation
3. On the Register page, fill in:
   - **Full name** — your name as it will appear in the system
   - **Email address** — used to log in (must be unique)
   - **Role** — choose **Admin** or **Worker** (see note below)
   - **Password** — minimum 6 characters; the strength meter gives live feedback
   - **Confirm password** — must match exactly
4. Click **Create Account** — you are automatically logged in and taken to the dashboard

> **Note on roles:** In most organizations, only one or a few people should have the Admin role. Workers cannot access admin functions even if they try to navigate there directly — the system blocks them.

### 2.2 Logging in

1. Visit [tooltracking.netlify.app/login](https://tooltracking.netlify.app/login)
2. Enter your **email** and **password**
3. Click **Sign In**

You will stay logged in for 30 days. After that, the system will ask you to log in again.

### 2.3 Logging out

Click the **Logout** button in the top-right navigation bar at any time.

---

## 3. Admin Guide

### 3.1 Admin Dashboard overview

After logging in as an admin you land on the **Dashboard**, which shows:

- **Assigned to You** — tools currently assigned to your own admin account
- **In Use** — tools checked out to workers
- **Available** — tools ready to be assigned
- **Pending Return** — return requests awaiting your verification

Use the **navigation bar** at the top to move between:
- **Dashboard** — your personal tool summary
- **All Tools** — read-only view of the full inventory
- **Manage Tools** — admin control panel (assignments, returns, add/edit/delete)

---

### 3.2 Managing tool inventory

Go to **Manage Tools** via the navigation bar.

#### Adding a new tool

1. Click the **Add New Tool** button (top-right of the Manage Tools page)
2. Fill in the form:

   | Field | Required | Description |
   |---|---|---|
   | Tool Name | Yes | Clear, descriptive name (e.g. "Makita Cordless Drill 18V") |
   | Description | No | Additional details about the tool |
   | Category | Yes | Hand Tools, Power Tools, Measuring Tools, Safety Equipment, or Other |
   | Condition | Yes | New / Good / Fair / Poor / Damaged |
   | Quantity | Yes | How many units of this tool exist |
   | Storage Location | Yes | Where the tool is kept (e.g. "Shelf B-3", "Red Tool Cabinet") |
   | Image URL | No | Link to an image of the tool (optional but helps workers identify tools) |

3. Click **Add Tool** — you are returned to Manage Tools and the tool appears in the list

> **Tip:** Use specific, consistent naming. "Drill" is ambiguous; "Cordless Drill — Makita 18V DHP458Z" makes auditing easy.

#### Viewing all tools

The **Manage Tools** table shows every tool in the system (except those with a pending return — those appear in the blue panel above). Columns show:

- Tool name and storage location
- Category
- Status badge
- Available / Total quantity
- Who it is assigned to (if anyone)
- Action buttons

Use the **search bar** to filter by tool name or worker name.

---

### 3.3 Assigning tools to workers

1. In the **Manage Tools** table, find the tool you want to assign (it must have status **Available**)
2. Click the green **person-plus icon** (Assign button) in the Actions column
3. A modal dialog appears — select the worker from the dropdown
   - Only worker-role accounts appear in the list
4. Click **Confirm Assignment**

The tool's status immediately changes to **In Use** and the available count decreases by one.

> **Important:** You can only assign an available tool. If a tool shows as In Use or Pending Return, it is not available until a return is confirmed.

---

### 3.4 Verifying and accepting returns

When a worker submits a return request, the tool enters **Pending Return** status. It stays assigned to the worker and the available count does **not** change yet.

A blue **Pending Returns** panel appears at the top of the Manage Tools page listing all outstanding requests. Each row shows:

- The tool name and category
- **Held by** — the worker currently holding it (still accountable)
- **Requested by** — who submitted the return request
- **Requested** — how long ago the request was made

#### To accept a return:

1. Physically locate and inspect the tool
2. Confirm it has been received in acceptable condition
3. Click the green **Accept** button next to the tool

The tool status changes to **Available**, the available count increases, and the tool is unassigned from the worker.

> **This is the key safeguard.** Never click Accept without physically seeing the tool. The whole point of this workflow is that the system reflects reality — a tool is only available when you have it in hand.

---

### 3.5 Rejecting a return request

If a worker claims to have returned a tool but you cannot locate it:

1. Click the red **Reject** button next to the tool in the Pending Returns panel
2. A dialog appears asking for a reason (optional but strongly recommended):
   - "Tool not found at drop-off location"
   - "Missing serial number sticker"
   - "Tool returned damaged — requires inspection"
3. Click **Confirm Rejection**

The tool reverts to **In Use** status, remains assigned to the worker, and the request is cleared. The worker can see from their Dashboard that the tool is still in their name.

> **Best practice:** When rejecting, always provide a reason and follow up with the worker directly to resolve the discrepancy.

---

### 3.6 Editing and deleting tools

**Edit a tool:**
1. Click the blue **pencil icon** next to the tool in the table
2. The Add/Edit Tool form opens pre-filled with current values
3. Update any fields and click **Save Changes**

**Delete a tool:**
1. Click the red **trash icon** next to the tool
2. A confirmation dialog appears — click OK to confirm
3. The tool is permanently removed from the system

> **Warning:** Deleting a tool that is assigned or has a pending return is not recommended. Resolve all assignments first.

---

## 4. Worker Guide

### 4.1 Your dashboard

After logging in you land on your **Dashboard**, which shows only the tools assigned to your account. The stats cards at the top give you a quick summary:

- **Assigned to You** — total tools in your name
- **In Use** — tools you are actively using
- **Available** — tools assigned to you that are currently not in use
- **Pending Return** — tools you have requested to return, awaiting admin confirmation

Each tool card shows the tool name, category, condition, status, and storage location.

---

### 4.2 Requesting a return

When you are done with a tool and want to return it:

1. Find the tool card on your Dashboard — it must show status **In Use**
2. Click the yellow **Request Return** button at the bottom of the card
3. A success message confirms your request was submitted

The tool status changes to **Pending Return**. An admin will physically verify the tool and confirm the return.

> **Important:** Clicking "Request Return" is not the same as actually returning the tool. You must physically bring the tool to its storage location or hand it to your admin. The system will not release you from responsibility until the admin confirms receipt.

---

### 4.3 Understanding pending return status

Once you click Request Return, your tool card shows:

- A **Pending Return** badge (blue)
- A spinning indicator
- The message: *"Return requested — awaiting admin confirmation. The tool is still in your responsibility until accepted."*

This means:

- The tool is still counted as yours
- You are still accountable for it
- An admin will check the tool physically and either accept or reject the return
- If rejected, the tool goes back to **In Use** in your name and you will need to resolve the issue with your admin

---

### 4.4 Browsing all tools

Click **All Tools** in the navigation bar to see the complete tool inventory for your organization.

Use the filters to narrow results:
- **Search box** — type any part of a tool name or description
- **Category** — Hand Tools, Power Tools, Measuring Tools, Safety Equipment, Other
- **Status** — Available, In Use, Pending Return, Damaged

This view is read-only for workers. You cannot assign or manage tools from here.

---

## 5. Tool Statuses Explained

| Status | Badge color | What it means |
|---|---|---|
| **Available** | Green | The tool is in stock and can be assigned to a worker |
| **In Use** | Yellow | The tool is currently assigned to a worker |
| **Pending Return** | Blue | The worker has requested a return; an admin must physically verify it |
| **Damaged** | Grey | The tool is out of service and cannot be assigned |

---

## 6. Return Verification Workflow

This is the core safety feature of ToolTrack. Here is the complete flow:

```
Worker has tool (In Use)
        │
        ▼
Worker clicks "Request Return"
        │
        ▼
Tool enters "Pending Return" state
  - Still assigned to worker
  - Availability count unchanged
  - Worker remains accountable
        │
        ▼
Admin sees tool in Pending Returns panel
        │
        ├─── Admin physically locates and checks the tool
        │
        ├─── Tool is present and OK ──► Admin clicks "Accept"
        │                                      │
        │                                      ▼
        │                             Tool → Available
        │                             Assigned to → Nobody
        │                             Count → +1
        │
        └─── Tool not found / issue ──► Admin clicks "Reject" + reason
                                               │
                                               ▼
                                      Tool → In Use (reverts)
                                      Worker still accountable
                                      Admin follows up directly
```

**Why this matters:** Without this workflow, a worker could click "Return" from their phone while the tool is still in their car or at a job site. By requiring admin confirmation, the system guarantees that availability data reflects reality.

---

## 7. Tips and Best Practices

**For Admins:**

- **Audit regularly.** Use the Manage Tools table to cross-reference your physical inventory with what the system shows.
- **Set accurate locations.** Use specific shelf or cabinet labels (e.g. "Shelf A-2, Warehouse 1") so workers can find tools quickly.
- **Inspect on acceptance.** Always check the condition of a returned tool before clicking Accept. If the condition has changed, update it via Edit Tool.
- **Reject with reasons.** A blank rejection gives the worker no actionable information. Always note why.
- **Delete with care.** Deleting a tool removes all history. Mark it Damaged instead if you may need the record.
- **Use descriptive names.** Include brand and model in tool names — "Drill" is not enough when you own five.

**For Workers:**

- **Return promptly.** Tools in your name that you are no longer using block other workers from accessing them.
- **Physically return before requesting.** Only click Request Return after you have actually placed the tool in its storage location or handed it to your admin.
- **Check your dashboard.** If a return shows as rejected, contact your admin immediately — the tool is still in your name.
- **Do not share tools.** If you need to hand a tool to a colleague, ask your admin to reassign it properly. Informal transfers create accountability gaps.

---

## 8. Frequently Asked Questions

**Q: I requested a return but the tool still shows on my dashboard. Is that normal?**  
A: Yes. The tool stays on your dashboard until an admin accepts the return. This is intentional — you are still responsible for it until the admin verifies physical receipt.

**Q: Can I cancel a return request?**  
A: Workers cannot cancel their own return requests. Contact your admin to reject it if you need to take the tool back.

**Q: I am a worker but I can see tools that are not assigned to me. Is that a bug?**  
A: No. The "All Tools" page shows the full inventory so workers can see what exists. Only the Dashboard is filtered to your assigned tools.

**Q: A return I submitted was rejected. What should I do?**  
A: Contact your admin — they likely could not locate the tool. Bring the tool to the agreed drop-off point and ask the admin to re-check and accept.

**Q: Can an admin assign a tool to themselves?**  
A: Yes. Admins appear in the user list if they have both an admin account and need to be assigned tools. However, it is generally best practice to keep admin accounts for management only and use separate worker accounts for receiving tools.

**Q: What happens to the quantity when a tool is assigned?**  
A: The Available quantity decreases by 1 when a tool is assigned. It only increases back by 1 when an admin confirms a return — not when a worker requests one.

**Q: Can a tool be assigned to multiple workers at once?**  
A: Currently one tool record maps to one assignee. If you have multiple units of the same tool, add them with a Quantity greater than 1. Each unit can be tracked individually by adding separate tool records.

**Q: How long does a login session last?**  
A: JWT tokens expire after 30 days. After that you will be redirected to the login page automatically.

**Q: I forgot my password. How do I reset it?**  
A: Contact your admin. There is a password reset script available in the backend (`backend/scripts/resetPassword.js`) that an admin or developer can run.

---

## 9. Troubleshooting

| Problem | Likely cause | What to do |
|---|---|---|
| Can't log in — "Login failed" | Wrong email or password | Double-check your credentials. Contact admin to reset if needed. |
| Page shows a spinner and never loads | Backend may be starting up (Render free tier sleeps) | Wait 30–60 seconds and refresh. Render free services sleep after 15 minutes of inactivity. |
| "Return Tool" button is greyed out | Tool is already pending return | You have already submitted a request. Wait for admin confirmation. |
| Manage Tools page not visible | You are logged in as a Worker | Only admins can access Manage Tools. |
| Tool shows as In Use but I returned it | Return not yet confirmed by admin | Check the Pending Returns panel in Manage Tools (admins) or wait for admin action. |
| Getting logged out unexpectedly | JWT token expired (30-day limit) | Log back in — your data is safe. |
| No tools showing in inventory | No tools added yet | Ask your admin to add tools via Manage Tools → Add New Tool. |
| Image not showing on a tool card | Invalid image URL | Edit the tool and use a direct link to an accessible image (ending in .jpg, .png, etc.). |

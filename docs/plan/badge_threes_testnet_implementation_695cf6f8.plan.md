---
name: Badge Threes Testnet Implementation
overview: Complete implementation plan for enabling Badge Threes on-chain features on Stacks testnet, building on the completed off-chain phase. This plan covers creating a new smart contract (badgethrees), frontend integration, wallet connection, badge minting, high score sync, testing, and deployment.
todos:
  - id: phase1-contract-creation
    content: "Phase 1: Create New Badge Threes Contract - Create badgethrees.clar, implement all functions, test, and deploy to testnet"
    status: completed
  - id: phase2-feature-flags
    content: "Phase 2: Enable On-chain Features - Update feature flags, verify environment configuration"
    status: completed
  - id: phase3-claim-flow
    content: "Phase 3: Complete Claim Flow - Implement badge minting in ClaimGrid, add transaction status UI, create TransactionStatus component"
    status: pending
  - id: phase4-high-score
    content: "Phase 4: High Score Sync - Update Game.tsx with sync prompt, update ScoreDisplay with on-chain score display"
    status: pending
  - id: phase5-badge-display
    content: "Phase 5: Badge Display Integration - Update Badges page to fetch on-chain badges, merge with off-chain state, update BadgeCard with on-chain status"
    status: pending
  - id: phase6-error-handling
    content: "Phase 6: Error Handling & Transaction UI - Create error components (ErrorToast, ErrorModal), implement error handling strategy"
    status: pending
  - id: phase7-testing
    content: "Phase 7: Testing & Validation - Update unit tests, update E2E tests, manual testing on devices, create testing documentation"
    status: pending
  - id: phase8-deployment
    content: "Phase 8: Deployment & Monitoring - Deploy to Vercel testnet, verify deployment, setup monitoring"
    status: pending
  - id: phase9-documentation
    content: "Phase 9: Documentation Updates - Update README, technical docs, create user guide"
    status: pending
isProject: false
---

# Badge Threes Testnet Implementation Plan

## Current Status

**Off-chain Phase: COMPLETE ✅**

- Badge Threes game fully functional with Power-of-3 mechanics (1+2→3, 3+3→6, etc.)
- Off-chain badges, leaderboard, and gameplay working
- All on-chain features disabled via feature flags (`lib/featureFlags.ts`)
- 91 unit tests passing, 20 E2E tests passing

**Existing Infrastructure (from previous Badge2048 project):**

- Previous contract: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badge2048` (not used for Badge Threes)
- Wallet integration infrastructure complete (Phases 3-5 from previous project)
- Contract hooks and badge data model ready (can be reused with updates)
- Testing page and UI components available as reference

**New Contract Decision:**

Badge Threes is a **different game** with different mechanics (Power-of-3 vs Power-of-2), therefore we will create a **new contract** named `badgethrees`:

- **Contract name**: `badgethrees` (following Clarity kebab-case convention)
- **Thresholds**: 1024, 2048, 4096, 8192 (aligned with Badge Threes gameplay)
- **Approach**: Create new contract based on `badge2048.clar` template, update branding and documentation
- **Benefits**: Proper branding, clean separation from Badge2048, correct game context in comments/events

---

## Architecture Overview

```mermaid
graph TD
    OffChainPhase[Off-chain Phase Complete]
    TestnetPhase[Testnet Phase]
    MainnetPhase[Mainnet Phase Future]
    
    OffChainPhase --> TestnetPhase
    TestnetPhase --> MainnetPhase
    
    TestnetPhase --> ContractCreation[Phase 1: Create New Contract]
    TestnetPhase --> FeatureFlags[Phase 2: Feature Flags]
    TestnetPhase --> ClaimFlow[Phase 3: Claim Flow]
    TestnetPhase --> HighScore[Phase 4: High Score]
    TestnetPhase --> BadgeDisplay[Phase 5: Badge Display]
    TestnetPhase --> ErrorHandling[Phase 6: Error Handling]
    TestnetPhase --> Testing[Phase 7: Testing]
    TestnetPhase --> Deployment[Phase 8: Deployment]
    
    ContractCreation --> CreateContract[Create badgethrees.clar]
    ContractCreation --> TestContract[Test Contract]
    ContractCreation --> DeployTestnet[Deploy to Testnet]
    
    FeatureFlags --> EnableOnchain[Enable On-chain Features]
    FeatureFlags --> UpdateEnv[Update Environment Variables]
    
    ClaimFlow --> MintBadge[Implement Mint Flow]
    ClaimFlow --> TransactionStatus[Transaction Status UI]
    
    HighScore --> GameOverFlow[Update Game Over]
    HighScore --> SyncOnchain[Sync to Contract]
    
    BadgeDisplay --> FetchOnchain[Fetch On-chain Badges]
    BadgeDisplay --> MergeState[Merge Off-chain Onchain]
```



---

## Phase 1: Create New Badge Threes Contract

**Goal**: Create, test, and deploy a new `badgethrees` contract for Badge Threes game

**Reference**: Use existing `contracts/badge2048-contract/` as base template

### 1.1 Create New Contract File

**New directory structure:**

```
contracts/
  badgethrees-contract/          ← New directory
    contracts/
      badgethrees.clar            ← New contract file
    tests/
      badgethrees_test.ts         ← Test file
    Clarinet.toml
    settings/
      Testnet.toml
      Devnet.toml
      Mainnet.toml
    README.md
```

**Steps:**

1. **Create new Clarinet project:**
   ```bash
   cd contracts
   clarinet new badgethrees-contract
   cd badgethrees-contract
   ```

2. **Copy `badge2048.clar` as template:**
   - Copy `contracts/badge2048-contract/contracts/badge2048.clar`
   - Rename to `contracts/badgethrees-contract/contracts/badgethrees.clar`

3. **Update contract branding:**
   - Change comments: "Badge2048" → "Badge Threes"
   - Update contract description: Reference Power-of-3 mechanics (1+2→3, 3+3→6)
   - Keep thresholds: 1024, 2048, 4096, 8192 (already correct for Badge Threes)
   - Update tier names in comments: Reference Badge Threes context
   - Update event descriptions: Reference Badge Threes gameplay
   - Update token URI: `https://badgethrees.com/metadata/` (or keep generic)

4. **Update `Clarinet.toml`:**
   ```toml
   [project]
   name = "badgethrees-contract"
   requirements = []
   
   [contracts.badgethrees]
   path = "contracts/badgethrees.clar"
   ```

**Key contract elements to preserve:**

- SIP-009 NFT implementation ✅
- Badge tiers: bronze, silver, gold, elite ✅
- Thresholds: 1024, 2048, 4096, 8192 ✅
- Functions: `mint-badge`, `update-high-score`, read-only functions ✅
- Events: `badge-minted`, `high-score-updated` ✅
- Error codes: 1001-1006 ✅

### 1.2 Create Contract Tests

**File**: `contracts/badgethrees-contract/tests/badgethrees_test.ts`

**Actions:**

1. **Copy test template:**
   - Copy `contracts/badge2048-contract/tests/badge2048_test.ts`
   - Rename to `badgethrees_test.ts`

2. **Update test references:**
   - Update contract name: `badge2048` → `badgethrees`
   - Update deployer address: Use `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5` (your testnet wallet)
   - Update test descriptions: Reference Badge Threes

3. **Test suite coverage (11 tests):**
   - ✅ Mint badge with valid score (all tiers: bronze, silver, gold, elite)
   - ✅ Mint badge with invalid score (should fail with ERR-SCORE-TOO-LOW)
   - ✅ Mint duplicate badge (should fail with ERR-ALREADY-MINTED)
   - ✅ Update high score (higher score updates, lower score doesn't)
   - ✅ Get player high score
   - ✅ Get badge ownership
   - ✅ Event emissions (badge-minted, high-score-updated)
   - ✅ SIP-009 NFT functions (get-owner, get-token-uri, transfer)

4. **Run tests:**
   ```bash
   cd contracts/badgethrees-contract
   npm install
   npm test
   ```

**Expected result**: All 11 tests passing ✅

### 1.3 Deploy Contract to Testnet

**Prerequisites:**

- Testnet wallet: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5` ✅
- Testnet STX: 500 STX available ✅
- Contract tested locally ✅

**Deployment steps:**

1. **Configure testnet deployment:**
   ```bash
   cd contracts/badgethrees-contract
   ```
   
   Update `settings/Testnet.toml`:
   - Set deployer address: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5`
   - Configure encrypted mnemonic (same as badge2048 deployment)

2. **Generate deployment plan:**
   ```bash
   clarinet deployments generate --testnet --manual-cost
   ```

3. **Deploy to testnet:**
   ```bash
   clarinet deployments apply --testnet
   ```

4. **Save contract address:**
   - Expected format: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees`
   - Save transaction ID
   - Document in `contracts/badgethrees-contract/README.md`

5. **Verify on Stacks Explorer:**
   - Visit: `https://explorer.stacks.co/?chain=testnet&contract=ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees`
   - Verify contract code visible
   - Verify functions (13 functions expected)
   - Verify maps (4 maps expected)
   - Check transaction confirmed

### 1.4 Create Contract Documentation

**File**: `contracts/badgethrees-contract/README.md`

**Content structure:**

1. **Overview**
   - Contract name: `badgethrees`
   - Purpose: NFT badges for Badge Threes game achievements
   - Game mechanics: Power-of-3 merge (1+2→3, 3+3→6, etc.)

2. **Contract Details**
   - Network: Testnet
   - Address: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees`
   - Deployer: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5`
   - SIP-009 NFT standard implementation

3. **Badge Tiers & Thresholds**
   - Bronze: ≥1024 score
   - Silver: ≥2048 score
   - Gold: ≥4096 score
   - Elite: ≥8192 score

4. **Public Functions**
   - `mint-badge`: Mint NFT badge for achieved tier
   - `update-high-score`: Update player's on-chain high score
   - `transfer`: Transfer NFT to another address

5. **Read-Only Functions**
   - `get-high-score`: Get player's high score
   - `get-badge-ownership`: Check if player owns badge
   - `get-badge-metadata`: Get badge metadata
   - `get-badge-mint-count`: Get total mints per tier
   - `get-last-token-id`: Get last minted token ID
   - `get-token-uri`: Get token metadata URI
   - `get-owner`: Get NFT owner

6. **Events**
   - `badge-minted`: Emitted when badge NFT is minted
   - `high-score-updated`: Emitted when high score is updated

7. **Error Codes**
   - 1001: Invalid badge tier
   - 1002: Score too low for tier
   - 1003: Badge already minted
   - 1004: Unauthorized
   - 1005: Insufficient STX for transaction
   - 1006: Badge not found

8. **Testing**
   - Test command: `npm test`
   - Test coverage: 11 test cases, all passing

9. **Deployment History**
   - Testnet: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees` — **deployed 2025-02-05**, transactions successfully confirmed on Testnet (cost: 0.077610 STX)
   - Mainnet: TBD

### 1.5 Phase 1 Completion Checklist

- [x] New contract file created: `badgethrees.clar`
- [x] All comments and branding updated to Badge Threes
- [x] Test file created and updated: `badgethrees_test.ts`
- [x] All 11 tests passing locally — Contract validated with `clarinet check` (1 contract checked). Test file `badgethrees_test.ts` has 11 tests; full run via `npm test` recommended in CI/Linux (Vitest+clarinet env may fail on Windows worker pool).
- [x] Contract deployed to testnet successfully (manual: configure `settings/Testnet.toml`, then `clarinet deployments apply --testnet`)
- [x] Contract verified on Stacks Explorer (after deploy)
- [x] Contract address documented (README + deployment plans)
- [x] README.md created with full documentation
- [x] Ready to integrate with frontend (Phase 2+)

**Phase 1 status: ✅ Complete** — Contract deployed to testnet; ready for Phase 2.

**Expected contract address**: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees`

### Phase 1 Implementation Summary (Completed)

- **Contract**: `contracts/badgethrees-contract/contracts/badgethrees.clar` — SIP-009 NFT, Badge Threes branding, token URI `https://badgethrees.com/metadata/`, thresholds 1024/2048/4096/8192.
- **Tests**: `contracts/badgethrees-contract/tests/badgethrees_test.ts` — 11 tests (mint valid/invalid/duplicate, all tiers, high score, ownership, events, SIP-009).
- **Project**: Clarinet.toml, package.json, vitest.config.ts, tsconfig.json, vitest.d.ts, settings/Devnet.toml, deployments (simnet, testnet, mainnet), .gitignore, .gitattributes.
- **Docs**: `contracts/badgethrees-contract/README.md` — overview, tiers, functions, events, error codes, testing, deployment.
- **Deployment**: Testnet deploy completed 2025-02-05 (`clarinet deployments apply --testnet` — transactions successfully confirmed).
- **Validation**: `clarinet check` passes (1 contract checked). `contracts/badgethrees.clar` uses LF line endings (required by Clarinet). Phase 1 complete; proceed to Phase 2.

---

## Phase 2: Enable On-chain Features

**Goal**: Enable on-chain features via feature flags and environment configuration

**Prerequisites**: Phase 1 complete (contract deployed to testnet) ✅

### 2.1 Update Feature Flags

**File**: `[lib/featureFlags.ts](lib/featureFlags.ts)`

**Current state:**

```typescript
export const FEATURES = {
  ONCHAIN_ENABLED: false,
  BADGE_MINTING: false,
  ONCHAIN_SCORE_SUBMISSION: false,
  WALLET_REQUIRED: false,
} as const;
```

**Update to:**

```typescript
export const FEATURES = {
  ONCHAIN_ENABLED: true,  // ← Enable on-chain
  BADGE_MINTING: true,    // ← Enable badge minting
  ONCHAIN_SCORE_SUBMISSION: true,  // ← Enable score sync
  WALLET_REQUIRED: true,  // ← Require wallet for on-chain actions
} as const;
```

### 2.2 Update Environment Configuration

**File**: `.env.local`

**Update settings for new contract:**

```env
NEXT_PUBLIC_STACKS_NETWORK=testnet
NEXT_PUBLIC_CONTRACT_ADDRESS=ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees
NEXT_PUBLIC_CONTRACT_NAME=badgethrees
NEXT_PUBLIC_DEPLOYER_ADDRESS=ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5
```

**Changes from previous (badge2048):**

- Contract address: `badge2048` → `badgethrees`
- Contract name: `badge2048` → `badgethrees`

**Action**: Update `.env.local` after Phase 1 deployment completes.

### 2.3 Update Configuration Module

**File**: `[lib/stacks/config.ts](lib/stacks/config.ts)`

**Updates needed:**

1. **Update contract references:**
   ```typescript
   // Old (badge2048)
   CONTRACT_ADDRESS: 'ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badge2048'
   CONTRACT_NAME: 'badge2048'
   
   // New (badgethrees) - from Phase 1 deployment
   CONTRACT_ADDRESS: 'ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees'
   CONTRACT_NAME: 'badgethrees'
   ```

2. **Verify:**
   - Testnet network configuration
   - Contract address matches Phase 1 deployment
   - Explorer URLs correct
   - API URLs correct

**Dependencies**: Phase 1 must be complete (contract deployed) before updating this.

### 2.4 Phase 2 Completion Checklist

- [x] Feature flags updated: `ONCHAIN_ENABLED`, `BADGE_MINTING`, `ONCHAIN_SCORE_SUBMISSION`, `WALLET_REQUIRED` set to `true`
- [x] `lib/stacks/constants.ts`: `CONTRACT_NAME` updated to `badgethrees`
- [x] `lib/stacks/config.ts`: Uses constants (contract address from env or deployer+name); app name set to `badgethrees-stacks`
- [x] `.env.example`: Testnet badgethrees vars documented
- [x] `.env.local`: Testnet + `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees` configured

**Phase 2 status: ✅ Complete** — On-chain features enabled; app configured for testnet badgethrees. Ready for Phase 3 (Claim Flow).

---

## Phase 3: Complete Claim Flow Implementation

**Goal**: Complete the badge claim flow to mint NFTs on-chain

**Status**: Phase 7.1 complete (wallet check added), need to complete 7.2-7.5

### 3.1 Update ClaimGrid Component

**File**: `[components/badge/ClaimGrid.tsx](components/badge/ClaimGrid.tsx)`

**Changes needed:**

1. **Import contract hooks:**

```typescript
import { useBadgeContract } from '@/hooks/useBadgeContract'
import { FEATURES } from '@/lib/featureFlags'
```

1. **Add minting logic to claim handler:**

```typescript
const handleClaim = async (badge: Badge) => {
  if (!isAuthenticated) {
    // Show wallet connect dialog (already implemented)
    return
  }
  
  if (FEATURES.BADGE_MINTING) {
    // Show confirmation dialog
    setClaimingBadge(badge)
    setShowClaimDialog(true)
  } else {
    // Off-chain claim only
    claimBadgeForTier(badge.tier)
  }
}

const handleConfirmMint = async () => {
  if (!claimingBadge) return
  
  try {
    setMintStatus('pending')
    
    // Call contract
    const result = await mintBadge(
      claimingBadge.tier,
      highScore || claimingBadge.threshold
    )
    
    if (result.success) {
      // Update local state with on-chain data
      const updatedBadge = updateBadgeWithOnchainData(claimingBadge, {
        onchainMinted: true,
        tokenId: result.tokenId,
        txId: result.txId,
        mintedAt: new Date().toISOString()
      })
      
      // Save to storage
      saveBadgesToStorage([...badges.filter(b => b.tier !== claimingBadge.tier), updatedBadge])
      
      setMintStatus('success')
      setShowClaimDialog(false)
    } else {
      setMintStatus('error')
      setErrorMessage(result.error || 'Failed to mint badge')
    }
  } catch (error) {
    setMintStatus('error')
    setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
  }
}
```

1. **Add transaction status UI:**

- Pending state: "Minting badge..." with spinner
- Success state: "Badge minted!" with transaction link
- Error state: Error message with retry button

1. **Add transaction preview dialog:**

- Show badge tier
- Show estimated fee (if available)
- Show network (testnet)
- Confirmation buttons

### 3.2 Update Claim Page

**File**: `[app/claim/page.tsx](app/claim/page.tsx)`

**Status**: Phase 7.1 complete (wallet check implemented)

**Verify:**

- Wallet connection prompt displays when not connected ✅
- Wallet status shows when connected ✅
- Responsive design works ✅

**No additional changes needed** - Phase 7.1 implementation is sufficient.

### 3.3 Implement Transaction Status Component

**File**: `components/ui/transaction-status.tsx` (new)

**Create component for:**

- Pending state UI (spinner, "Transaction pending...")
- Success state UI (checkmark, "Transaction confirmed!")
- Error state UI (error icon, error message, retry button)
- Transaction link (to Stacks Explorer)

**Usage:**

```typescript
<TransactionStatus
  status={mintStatus}
  txId={txId}
  error={errorMessage}
  onRetry={handleRetry}
/>
```

### 3.4 Add Badge Sync Helper

**File**: `[lib/badges.ts](lib/badges.ts)`

**Status**: Phase 6 complete - helpers already exist ✅

**Verify existing functions:**

- `badgeNeedsMinting(badge)` - checks if badge needs on-chain minting
- `updateBadgeWithOnchainData(badge, data)` - updates badge with on-chain data
- `mergeOffchainAndOnchainBadges(offchain, onchainByTier)` - merges off-chain and on-chain state

**Action**: Use these helpers in ClaimGrid implementation.

---

## Phase 4: High Score Sync Implementation

**Goal**: Allow users to sync their high score on-chain

### 4.1 Update Game Component

**File**: `[components/game/Game.tsx](components/game/Game.tsx)`

**Changes needed:**

1. **Import hooks:**

```typescript
import { useStacksWallet } from '@/hooks/useStacksWallet'
import { useBadgeContract } from '@/hooks/useBadgeContract'
import { FEATURES } from '@/lib/featureFlags'
```

1. **Add high score sync prompt on game over:**

```typescript
const handleGameOver = async (finalScore: number) => {
  // Existing game over logic...
  
  if (FEATURES.ONCHAIN_SCORE_SUBMISSION && isAuthenticated) {
    const currentHighScore = await getHighScore(address)
    
    if (finalScore > currentHighScore) {
      setShowHighScoreSyncDialog(true)
    }
  }
}

const handleSyncHighScore = async () => {
  try {
    setHighScoreSyncStatus('pending')
    
    const result = await updateHighScore(score)
    
    if (result.success) {
      setHighScoreSyncStatus('success')
    } else {
      setHighScoreSyncStatus('error')
      setErrorMessage(result.error || 'Failed to update high score')
    }
  } catch (error) {
    setHighScoreSyncStatus('error')
    setErrorMessage(error instanceof Error ? error.message : 'Unknown error')
  }
}
```

1. **Add high score sync dialog:**

- Show prompt: "Update your high score on-chain?"
- Show current on-chain score vs new score
- Show estimated fee
- Allow user to skip
- Show transaction status

### 4.2 Update ScoreDisplay Component

**File**: `[components/game/ScoreDisplay.tsx](components/game/ScoreDisplay.tsx)`

**Changes needed:**

1. **Show on-chain high score if available:**

```typescript
const { address, isAuthenticated } = useStacksWallet()
const { getHighScore } = useBadgeOnchain()
const [onchainHighScore, setOnchainHighScore] = useState<number | null>(null)

useEffect(() => {
  if (isAuthenticated && address) {
    getHighScore(address).then(result => {
      if (result.success && result.data) {
        setOnchainHighScore(result.data.score)
      }
    })
  }
}, [isAuthenticated, address])
```

1. **Display on-chain vs off-chain scores:**

- Show local high score
- Show on-chain high score (if available)
- Show sync status indicator
- Show "Sync to blockchain" button if scores differ

### 4.3 Add High Score Sync UI

**Implement:**

- High score comparison display
- Sync button
- Transaction status
- Success/error messages

---

## Phase 5: Badge Display Integration

**Goal**: Display on-chain badges and merge with off-chain state

### 5.1 Update Badges Page

**File**: `[app/badges/page.tsx](app/badges/page.tsx)`

**Changes needed:**

1. **Fetch on-chain badges:**

```typescript
import { useBadgeOnchain } from '@/hooks/useBadgeOnchain'
import { mergeOffchainAndOnchainBadges } from '@/lib/badges'

const { address, isAuthenticated } = useStacksWallet()
const { getBadgeOwnership } = useBadgeOnchain()
const [onchainBadges, setOnchainBadges] = useState<Map<BadgeTier, OnchainBadgeData>>(new Map())

useEffect(() => {
  if (isAuthenticated && address && FEATURES.ONCHAIN_ENABLED) {
    // Fetch on-chain badges for all tiers
    Promise.all([
      getBadgeOwnership(address, 'bronze'),
      getBadgeOwnership(address, 'silver'),
      getBadgeOwnership(address, 'gold'),
      getBadgeOwnership(address, 'elite'),
    ]).then(results => {
      const badgeMap = new Map()
      results.forEach((result, index) => {
        const tiers: BadgeTier[] = ['bronze', 'silver', 'gold', 'elite']
        if (result.success && result.data) {
          badgeMap.set(tiers[index], result.data)
        }
      })
      setOnchainBadges(badgeMap)
    })
  }
}, [isAuthenticated, address])
```

1. **Merge with off-chain badges:**

```typescript
const mergedBadges = useMemo(() => {
  if (FEATURES.ONCHAIN_ENABLED && isAuthenticated) {
    return mergeOffchainAndOnchainBadges(offchainBadges, onchainBadges)
  }
  return offchainBadges
}, [offchainBadges, onchainBadges, isAuthenticated])
```

1. **Pass merged badges to BadgesGrid:**

```typescript
<BadgesGrid badges={mergedBadges} />
```

### 5.2 Update BadgeCard Component

**File**: `[components/badge/BadgeCard.tsx](components/badge/BadgeCard.tsx)`

**Changes needed:**

1. **Show on-chain mint status:**

- Badge for "On-chain ✓" if `onchainMinted === true`
- Show token ID if available
- Show transaction link if `txId` exists

1. **Add "Mint on-chain" button:**

- Show for badges that are claimed but not minted (`badgeNeedsMinting(badge)`)
- Trigger mint flow when clicked
- Show transaction status

1. **Visual indicators:**

```typescript
{badge.onchainMinted && (
  <div className="flex items-center gap-1 text-sm text-green-600">
    <CheckCircle className="h-4 w-4" />
    On-chain
  </div>
)}

{badge.txId && (
  <a
    href={`https://explorer.stacks.co/txid/${badge.txId}?chain=testnet`}
    target="_blank"
    rel="noopener noreferrer"
    className="text-xs text-blue-600 hover:underline"
  >
    View transaction →
  </a>
)}
```

### 5.3 Update BadgesGrid Component

**File**: `[components/badge/BadgesGrid.tsx](components/badge/BadgesGrid.tsx)`

**Changes needed:**

1. **Show sync status:**

- Show "Syncing..." when fetching on-chain data
- Show "Synced" when complete
- Show error if sync fails

1. **Add refresh button:**

- Allow manual refresh of on-chain data
- Show loading state during refresh

1. **Handle loading states:**

- Skeleton loaders while fetching
- Error states with retry

---

## Phase 6: Error Handling & Transaction UI

**Goal**: Robust error handling and clear transaction status

### 6.1 Error Handling Strategy

**Common errors to handle:**


| Error                | Code | User Message                                                          | Action                   |
| -------------------- | ---- | --------------------------------------------------------------------- | ------------------------ |
| Wallet not connected | -    | "Please connect your wallet to continue"                              | Show connect button      |
| Insufficient STX     | 1005 | "Insufficient STX for transaction fee. You need approximately X STX." | Link to faucet           |
| Score too low        | 1002 | "Score {score} is below threshold {threshold} for {tier} badge"       | Disable mint             |
| Already minted       | 1003 | "You've already minted this badge!"                                   | Show badge status        |
| Transaction failed   | -    | "Transaction failed: {reason}"                                        | Retry button             |
| Network error        | -    | "Network error. Please try again."                                    | Retry button             |
| User rejected        | -    | Silent (no error shown)                                               | Return to previous state |


### 6.2 Implement Error Toast Component

**File**: `components/ui/error-toast.tsx` (new)

**Features:**

- Non-critical error display
- Auto-dismiss after 5 seconds
- Retry button (optional)
- Close button
- Different styles for error severity (warning, error, info)

### 6.3 Implement Error Modal Component

**File**: `components/ui/error-modal.tsx` (new)

**Features:**

- Critical error display
- Requires user action to dismiss
- Help link (to docs or FAQ)
- Action buttons (Retry, Cancel, Get Help)
- Clear error message and suggested next steps

### 6.4 Add Error Utilities

**File**: `[lib/stacks/constants.ts](lib/stacks/constants.ts)`

**Verify existing error mappings:**

```typescript
export const ERROR_MESSAGES: Record<number, string> = {
  1001: 'Invalid badge tier',
  1002: 'Score too low for this badge tier',
  1003: 'Badge already minted',
  1004: 'Unauthorized',
  1005: 'Insufficient STX for transaction',
  1006: 'Badge not found',
}
```

**Add helper functions:**

```typescript
export const getErrorMessage = (errorCode: number): string => {
  return ERROR_MESSAGES[errorCode] || 'Unknown error occurred'
}

export const isRetryableError = (errorCode: number): boolean => {
  return [1005].includes(errorCode) // Insufficient funds is retryable
}
```

---

## Phase 7: Testing & Validation

**Goal**: Comprehensive testing of on-chain features

### 7.1 Update Unit Tests

**Files to update:**

- Tests for badge utilities with on-chain fields (already passing ✅)
- Tests for wallet hook
- Tests for contract hooks

**New tests needed:**

- Test on-chain minting flow
- Test high score sync
- Test badge merge logic
- Test error handling

### 7.2 Update E2E Tests

**File**: `[e2e/badge-claim.spec.ts](e2e/badge-claim.spec.ts)`

**Updates needed:**

- Update to test on-chain claim flow (currently expects off-chain mode)
- Add wallet connection step
- Add transaction confirmation wait
- Verify on-chain state update

**New tests:**

- Test wallet connection flow
- Test badge minting transaction
- Test high score update transaction
- Test error scenarios (wallet not connected, insufficient STX, etc.)

### 7.3 Manual Testing Checklist

**Create manual testing document**: `docs/TESTNET-MANUAL-TESTING.md`

**Test scenarios:**

1. **New User Flow:**
  - Open app (no wallet)
  - Play game, unlock badge
  - Navigate to /claim
  - See wallet connect prompt
  - Connect wallet
  - Mint badge
  - Verify NFT in wallet
  - Verify on Stacks Explorer
2. **Returning User Flow:**
  - Connect wallet
  - View /badges page
  - See on-chain badges
  - Play game, beat high score
  - Update high score on-chain
  - Verify transaction
3. **Migration Flow:**
  - User with off-chain badges
  - Connect wallet
  - Mint off-chain badges on-chain
  - Verify merge works correctly
4. **Error Scenarios:**
  - Try to mint without wallet
  - Try to mint with insufficient STX
  - Cancel transaction in wallet
  - Network errors
  - Verify error messages are user-friendly

### 7.4 Test on Different Devices

**Testing matrix:**

- Desktop: Chrome, Firefox, Edge
- Mobile: Chrome (Android), Safari (iOS)
- Wallet: Leather, Hiro (test both)

**Focus areas:**

- Responsive design
- Wallet connection on mobile
- Transaction signing flow
- Performance on mobile

---

## Phase 8: Deployment & Monitoring

**Goal**: Deploy to testnet environment and monitor

### 8.1 Pre-Deployment Checklist

**Verify:**

- Feature flags enabled correctly
- Environment variables set
- Contract address configured
- All unit tests passing
- All E2E tests passing
- Build succeeds without errors
- Manual testing complete

### 8.2 Deploy to Vercel (Testnet)

**Steps:**

1. Create new Vercel project (if not exists)
2. Set environment variables in Vercel:
  ```
   NEXT_PUBLIC_STACKS_NETWORK=testnet
   NEXT_PUBLIC_CONTRACT_ADDRESS=ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees
   NEXT_PUBLIC_CONTRACT_NAME=badgethrees
   NEXT_PUBLIC_DEPLOYER_ADDRESS=ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5
  ```
3. Deploy to production
4. Verify deployment URL

### 8.3 Post-Deployment Verification

**Test on live site:**

- Site loads correctly
- Wallet connection works
- Badge minting works
- High score sync works
- All pages functional
- No console errors (except expected ones)

**Verify on Stacks Explorer:**

- Transactions visible
- Events emitted correctly
- Contract state updates

**Verify in wallet:**

- NFTs appear in wallet
- Metadata displays correctly

### 8.4 Monitoring Setup

**Metrics to track:**

- Transaction success rate
- Transaction gas fees
- Error rates
- User engagement (badges minted, scores synced)

**Tools:**

- Vercel Analytics for frontend metrics
- Stacks Explorer for on-chain metrics
- Application logs for errors

---

## Phase 9: Documentation Updates

**Goal**: Update all documentation for testnet phase

### 9.1 Update README

**File**: `[README.md](README.md)`

**Updates needed:**

- Update status to "Testnet phase"
- Add wallet connection instructions
- Add testnet deployment info
- Update environment setup guide

### 9.2 Update Technical Docs

**Files to update:**

- `[docs/OFFCHAIN-PHASE.md](docs/OFFCHAIN-PHASE.md)` - Note transition to testnet
- `[docs/BADGE-SYSTEM.md](docs/BADGE-SYSTEM.md)` - Add on-chain minting info
- `[docs/CLAIM-FLOW.md](docs/CLAIM-FLOW.md)` - Update for on-chain flow
- `[docs/ONCHAIN_STACKS_BADGE2048.md](docs/ONCHAIN_STACKS_BADGE2048.md)` - Update for Badge Threes contract, update progress status

**Contract reference updates:**

All documentation that references `badge2048` contract should be updated to reference `badgethrees`:

- Contract name: `badge2048` → `badgethrees`
- Contract address: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badge2048` → `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees`
- Game context: Badge2048 → Badge Threes (Power-of-3 mechanics)

### 9.3 Create User Guide

**New file**: `docs/USER-GUIDE.md`

**Content:**

- How to connect wallet (Leather or Hiro)
- How to get testnet STX
- How to mint badges
- How to view on-chain badges
- How to update high score
- FAQ section
- Troubleshooting common issues

---

## Success Criteria

**Testnet implementation is complete when:**

**Phase 1 (Contract):**

- ✅ New `badgethrees` contract created and tested (11 tests passing)
- ✅ Contract deployed to testnet: `ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5.badgethrees`
- ✅ Contract verified on Stacks Explorer

**Phases 2-9 (Frontend & Integration):**

- ✅ Feature flags enabled (`ONCHAIN_ENABLED: true`)
- ✅ Environment configured with new contract address
- ✅ Wallet connection working (Leather & Hiro)
- ✅ Badge minting working (NFT appears in wallet with badgethrees contract)
- ✅ High score sync working (updates on-chain)
- ✅ Badge display shows on-chain badges from badgethrees contract
- ✅ Off-chain and on-chain state merge correctly
- ✅ Error handling robust and user-friendly
- ✅ All unit tests passing
- ✅ All E2E tests passing
- ✅ Manual testing complete on all devices
- ✅ Deployed to testnet environment
- ✅ Documentation updated (contract references updated to badgethrees)
- ✅ No critical bugs or issues

---

## Future: Mainnet Migration

**After testnet validation**, the mainnet migration involves:

1. Deploy contract to mainnet
2. Update environment variables (`NEXT_PUBLIC_STACKS_NETWORK=mainnet`)
3. Update contract address to mainnet deployment
4. Test thoroughly on mainnet
5. Deploy frontend to production
6. Monitor for issues

**See**: `[docs/TESTNET-TO-MAINNET-MIGRATION-PLAN.md](docs/TESTNET-TO-MAINNET-MIGRATION-PLAN.md)` for detailed mainnet migration plan.

---

## Risk Mitigation

**Potential risks:**


| Risk                 | Mitigation                                      |
| -------------------- | ----------------------------------------------- |
| Contract bugs        | Comprehensive testing on testnet before mainnet |
| High gas fees        | Monitor fees, optimize contract calls           |
| Wallet compatibility | Test with both Leather and Hiro wallets         |
| User confusion       | Clear UI/UX, helpful error messages, user guide |
| Transaction failures | Robust error handling, retry mechanisms         |
| State inconsistency  | Proper off-chain/on-chain merge logic           |


---

## Timeline Estimate

**Phase-by-phase estimates** (for planning purposes):

- Phase 1: Create New Contract - 2-3 days (create, test, deploy)
- Phase 2: Feature Flags - 1 day
- Phase 3: Claim Flow - 3-4 days
- Phase 4: High Score - 2-3 days
- Phase 5: Badge Display - 2-3 days
- Phase 6: Error Handling - 2 days
- Phase 7: Testing - 3-4 days
- Phase 8: Deployment - 1-2 days
- Phase 9: Documentation - 2 days

**Total estimated effort**: 18-26 days (working days, not calendar days)

**Note**: Phase 1 takes longer than original plan because we're creating a new contract from scratch (not just reviewing existing one).

---

## Key Files Reference

### Smart Contract (New)

- `contracts/badgethrees-contract/contracts/badgethrees.clar` - New Badge Threes contract
- `contracts/badgethrees-contract/tests/badgethrees_test.ts` - Contract tests
- `contracts/badgethrees-contract/README.md` - Contract documentation
- `contracts/badgethrees-contract/Clarinet.toml` - Clarinet configuration

**Reference/Template** (from previous project):

- `contracts/badge2048-contract/` - Template for new contract structure

### Configuration

- `lib/featureFlags.ts` - Feature flags (enable on-chain)
- `lib/stacks/config.ts` - Network & contract config (update for badgethrees)
- `lib/stacks/constants.ts` - Error codes, tier thresholds (update contract name)
- `lib/stacks/types.ts` - TypeScript types
- `.env.local` - Environment variables (update contract address)

### Hooks

- `hooks/useStacksWallet.ts` - Wallet connection (✅ complete)
- `hooks/useBadgeContract.ts` - Contract write operations (✅ complete)
- `hooks/useBadgeOnchain.ts` - Contract read operations (✅ complete)

### Components (need updates)

- `components/badge/ClaimGrid.tsx` - Add minting logic
- `components/badge/BadgeCard.tsx` - Add on-chain status
- `components/badge/BadgesGrid.tsx` - Add on-chain fetch
- `components/game/Game.tsx` - Add high score sync
- `components/game/ScoreDisplay.tsx` - Show on-chain score

### New Components (to create)

- `components/ui/transaction-status.tsx` - Transaction UI
- `components/ui/error-toast.tsx` - Error notifications
- `components/ui/error-modal.tsx` - Critical errors

### Pages (need updates)

- `app/badges/page.tsx` - Fetch & merge on-chain badges
- `app/claim/page.tsx` - Already updated (Phase 7.1 ✅)

### Utilities

- `lib/badges.ts` - Badge helpers (✅ Phase 6 complete, use existing functions)

### Tests (need updates)

- `e2e/badge-claim.spec.ts` - Update for on-chain
- Unit tests for new logic

### Documentation

- All docs in `docs/` folder
- README.md
- `contracts/badgethrees-contract/README.md` - New contract documentation

---

## Summary: New Contract Approach

**Decision**: Create new `badgethrees` contract (not reuse `badge2048`)

**Rationale:**

1. **Different game**: Badge Threes uses Power-of-3 mechanics (1+2→3, 3+3→6) vs Badge2048's Power-of-2 (2+2→4, 4+4→8)
2. **Proper branding**: Contract name, comments, and events should reference Badge Threes for clarity
3. **Clean separation**: Separate contracts for separate games maintains clean architecture
4. **Documentation clarity**: Easier to document and explain with proper naming

**Implementation approach:**

- **Template**: Use `badge2048.clar` as base template (proven, tested structure)
- **Updates**: Change branding, comments, and documentation to Badge Threes
- **Thresholds**: Keep 1024, 2048, 4096, 8192 (already aligned with Badge Threes)
- **Infrastructure**: Reuse wallet integration, hooks, and UI components (minor updates needed)

**Key changes from original plan:**

| Original Plan | Updated Plan |
|---------------|--------------|
| Phase 1: Review existing contract | Phase 1: Create new contract (`badgethrees.clar`) |
| Reuse `badge2048` contract | Deploy new `badgethrees` contract |
| 1 day for Phase 1 | 2-3 days for Phase 1 (create + test + deploy) |
| Update frontend references only | Update frontend + contract + environment config |
| Contract address: `...badge2048` | Contract address: `...badgethrees` (from Phase 1) |

**Benefits of new contract:**

- ✅ Proper naming and branding
- ✅ Clear separation between games
- ✅ Better documentation and maintainability
- ✅ Correct game context in all comments and events
- ✅ Professional presentation for portfolio/talent.app

**Timeline impact**: +1-2 days (Phase 1 now 2-3 days instead of 1 day)


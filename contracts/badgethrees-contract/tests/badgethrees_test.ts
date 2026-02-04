import { describe, it, expect } from "vitest";
import { Cl } from "@stacks/transactions";

describe("Badge Threes Contract Tests", () => {
  describe("Mint Badge", () => {
    it("should mint badge with valid score", () => {
      const wallet1 = simnet.deployer;

      const result = simnet.callPublicFn(
        "badgethrees",
        "mint-badge",
        [Cl.stringAscii("bronze"), Cl.uint(1024)],
        wallet1
      );

      expect(result.result).toBeOk(Cl.uint(1));

      const ownership = simnet.callReadOnlyFn(
        "badgethrees",
        "get-badge-ownership",
        [Cl.principal(wallet1), Cl.stringAscii("bronze")],
        wallet1
      );
      expect(ownership.result).toBeOk(Cl.some(Cl.uint(1)));

      const highScore = simnet.callReadOnlyFn(
        "badgethrees",
        "get-high-score",
        [Cl.principal(wallet1)],
        wallet1
      );
      expect(highScore.result).toBeOk(Cl.uint(1024));
    });

    it("should fail to mint badge with invalid score (too low)", () => {
      const wallet1 = simnet.deployer;

      const result = simnet.callPublicFn(
        "badgethrees",
        "mint-badge",
        [Cl.stringAscii("bronze"), Cl.uint(500)],
        wallet1
      );

      expect(result.result).toBeErr(Cl.uint(1002));
    });

    it("should fail to mint duplicate badge", () => {
      const wallet1 = simnet.deployer;

      const result1 = simnet.callPublicFn(
        "badgethrees",
        "mint-badge",
        [Cl.stringAscii("bronze"), Cl.uint(1024)],
        wallet1
      );
      expect(result1.result).toBeOk(Cl.uint(1));

      const result2 = simnet.callPublicFn(
        "badgethrees",
        "mint-badge",
        [Cl.stringAscii("bronze"), Cl.uint(2048)],
        wallet1
      );

      expect(result2.result).toBeErr(Cl.uint(1003));
    });

    it("should mint all badge tiers", () => {
      const wallet1 = simnet.deployer;

      expect(
        simnet.callPublicFn(
          "badgethrees",
          "mint-badge",
          [Cl.stringAscii("bronze"), Cl.uint(1024)],
          wallet1
        ).result
      ).toBeOk(Cl.uint(1));
      expect(
        simnet.callPublicFn(
          "badgethrees",
          "mint-badge",
          [Cl.stringAscii("silver"), Cl.uint(2048)],
          wallet1
        ).result
      ).toBeOk(Cl.uint(2));
      expect(
        simnet.callPublicFn(
          "badgethrees",
          "mint-badge",
          [Cl.stringAscii("gold"), Cl.uint(4096)],
          wallet1
        ).result
      ).toBeOk(Cl.uint(3));
      expect(
        simnet.callPublicFn(
          "badgethrees",
          "mint-badge",
          [Cl.stringAscii("elite"), Cl.uint(8192)],
          wallet1
        ).result
      ).toBeOk(Cl.uint(4));

      expect(
        simnet.callReadOnlyFn(
          "badgethrees",
          "get-badge-ownership",
          [Cl.principal(wallet1), Cl.stringAscii("bronze")],
          wallet1
        ).result
      ).toBeOk(Cl.some(Cl.uint(1)));
      expect(
        simnet.callReadOnlyFn(
          "badgethrees",
          "get-badge-ownership",
          [Cl.principal(wallet1), Cl.stringAscii("silver")],
          wallet1
        ).result
      ).toBeOk(Cl.some(Cl.uint(2)));
      expect(
        simnet.callReadOnlyFn(
          "badgethrees",
          "get-badge-ownership",
          [Cl.principal(wallet1), Cl.stringAscii("gold")],
          wallet1
        ).result
      ).toBeOk(Cl.some(Cl.uint(3)));
      expect(
        simnet.callReadOnlyFn(
          "badgethrees",
          "get-badge-ownership",
          [Cl.principal(wallet1), Cl.stringAscii("elite")],
          wallet1
        ).result
      ).toBeOk(Cl.some(Cl.uint(4)));
    });
  });

  describe("High Score", () => {
    it("should update high score", () => {
      const wallet1 = simnet.deployer;

      expect(
        simnet.callPublicFn(
          "badgethrees",
          "update-high-score",
          [Cl.uint(1000)],
          wallet1
        ).result
      ).toBeOk(Cl.bool(true));
      expect(
        simnet.callPublicFn(
          "badgethrees",
          "update-high-score",
          [Cl.uint(2000)],
          wallet1
        ).result
      ).toBeOk(Cl.bool(true));
      expect(
        simnet.callPublicFn(
          "badgethrees",
          "update-high-score",
          [Cl.uint(1500)],
          wallet1
        ).result
      ).toBeOk(Cl.bool(false));

      const highScore = simnet.callReadOnlyFn(
        "badgethrees",
        "get-high-score",
        [Cl.principal(wallet1)],
        wallet1
      );
      expect(highScore.result).toBeOk(Cl.uint(2000));
    });

    it("should get player high score", () => {
      const wallet1 = simnet.deployer;

      simnet.callPublicFn(
        "badgethrees",
        "mint-badge",
        [Cl.stringAscii("bronze"), Cl.uint(1024)],
        wallet1
      );

      const highScore = simnet.callReadOnlyFn(
        "badgethrees",
        "get-high-score",
        [Cl.principal(wallet1)],
        wallet1
      );
      expect(highScore.result).toBeOk(Cl.uint(1024));
    });
  });

  describe("Badge Ownership", () => {
    it("should get badge ownership", () => {
      const wallet1 = simnet.deployer;
      const wallet2 = "ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5";

      simnet.callPublicFn(
        "badgethrees",
        "mint-badge",
        [Cl.stringAscii("silver"), Cl.uint(2048)],
        wallet1
      );

      const ownership1 = simnet.callReadOnlyFn(
        "badgethrees",
        "get-badge-ownership",
        [Cl.principal(wallet1), Cl.stringAscii("silver")],
        wallet1
      );
      expect(ownership1.result).toBeOk(Cl.some(Cl.uint(1)));

      const ownership2 = simnet.callReadOnlyFn(
        "badgethrees",
        "get-badge-ownership",
        [Cl.principal(wallet2), Cl.stringAscii("silver")],
        wallet2
      );
      expect(ownership2.result).toBeOk(Cl.none());
    });
  });

  describe("Events", () => {
    it("should emit badge-minted event on mint", () => {
      const wallet1 = simnet.deployer;
      const { result, events } = simnet.callPublicFn(
        "badgethrees",
        "mint-badge",
        [Cl.stringAscii("bronze"), Cl.uint(1024)],
        wallet1
      );
      expect(result).toBeOk(Cl.uint(1));
      expect(events.length).toBeGreaterThan(0);
      expect(JSON.stringify(events)).toContain("badge-minted");
    });

    it("should emit high-score-updated event on update", () => {
      const wallet1 = simnet.deployer;
      const { result, events } = simnet.callPublicFn(
        "badgethrees",
        "update-high-score",
        [Cl.uint(3000)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(true));
      expect(events.length).toBeGreaterThan(0);
      expect(JSON.stringify(events)).toContain("high-score-updated");
    });

    it("should not emit high-score-updated when score not higher", () => {
      const wallet1 = simnet.deployer;
      simnet.callPublicFn(
        "badgethrees",
        "update-high-score",
        [Cl.uint(5000)],
        wallet1
      );
      const { result, events } = simnet.callPublicFn(
        "badgethrees",
        "update-high-score",
        [Cl.uint(4000)],
        wallet1
      );
      expect(result).toBeOk(Cl.bool(false));
      expect(events.length).toBe(0);
    });
  });

  describe("SIP-009 NFT Functions", () => {
    it("should implement SIP-009 NFT functions", () => {
      const wallet1 = simnet.deployer;
      const wallet2 = "ST22ZCY5GAH27T4CK3ATG4QTZJQV6FXPRBAQ0BRW5";

      const mintResult = simnet.callPublicFn(
        "badgethrees",
        "mint-badge",
        [Cl.stringAscii("bronze"), Cl.uint(1024)],
        wallet1
      );
      expect(mintResult.result).toBeOk(Cl.uint(1));

      const owner = simnet.callReadOnlyFn(
        "badgethrees",
        "get-owner",
        [Cl.uint(1)],
        wallet1
      );
      expect(owner.result).toBeOk(Cl.some(Cl.principal(wallet1)));

      const lastId = simnet.callReadOnlyFn(
        "badgethrees",
        "get-last-token-id",
        [],
        wallet1
      );
      expect(lastId.result).toBeOk(Cl.uint(1));

      const tokenUri = simnet.callReadOnlyFn(
        "badgethrees",
        "get-token-uri",
        [Cl.uint(1)],
        wallet1
      );
      expect(tokenUri.result).toBeOk(
        Cl.some(Cl.stringAscii("https://badgethrees.com/metadata/"))
      );

      const transferResult = simnet.callPublicFn(
        "badgethrees",
        "transfer",
        [
          Cl.uint(1),
          Cl.principal(wallet1),
          Cl.principal(wallet2),
        ],
        wallet1
      );
      expect(transferResult.result).toBeOk(Cl.bool(true));

      const newOwner = simnet.callReadOnlyFn(
        "badgethrees",
        "get-owner",
        [Cl.uint(1)],
        wallet2
      );
      expect(newOwner.result).toBeOk(Cl.some(Cl.principal(wallet2)));
    });
  });
});

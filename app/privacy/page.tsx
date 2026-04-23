import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy — Sip",
  description:
    "How Sip collects, uses, shares, and protects your information. Written plainly.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      eyebrow="Privacy"
      title="Privacy Policy"
      effectiveDate="April 22, 2026"
    >
      <p>
        Sip is a live map of nightlife — bars, crews, and the people you
        actually go out with. To make that work we collect some information
        about you, what you do in the app, and where you are. This policy
        explains what, why, and what you can do about it. If anything here is
        unclear, email <a href="mailto:sam@sipapp.co">sam@sipapp.co</a> and
        we&rsquo;ll answer plainly.
      </p>

      <p>
        This policy applies to the Sip mobile app, the Sip website at{" "}
        <a href="https://sipapp.co">sipapp.co</a>, and any related services
        operated by Sip, Inc. (&ldquo;Sip,&rdquo; &ldquo;we,&rdquo;
        &ldquo;us&rdquo;). By using Sip you agree to this policy and to our{" "}
        <a href="/terms">Terms of Service</a>.
      </p>

      <h2>Who can use Sip</h2>
      <p>
        Sip is a 21+ product. We do not knowingly collect information from
        anyone under 21. If you believe a minor has created an account, email{" "}
        <a href="mailto:sam@sipapp.co">sam@sipapp.co</a> and we will remove it.
      </p>

      <h2>Information we collect</h2>

      <h3>You give us directly</h3>
      <ul>
        <li>
          <strong>Account details:</strong> first and last name, username,
          email, date of birth (used to confirm 21+), city, and optionally
          gender. For bar administrator accounts, the venue you represent.
        </li>
        <li>
          <strong>Authentication credentials:</strong> if you sign up with
          email, a password that is hashed and stored by Firebase
          Authentication. If you sign in with Google, the email and basic
          profile Google returns to us.
        </li>
        <li>
          <strong>Profile:</strong> initials shown in place of a photo, a
          public/private toggle, and the bars you follow, favorite, or have
          visited.
        </li>
        <li>
          <strong>Content you create:</strong> posts, photos, comments, event
          RSVPs, line-report photos, and messages in crews.
        </li>
        <li>
          <strong>Permission choices:</strong> which of Location, Notifications,
          Contacts, and Camera you have allowed.
        </li>
      </ul>

      <h3>We collect as you use the app</h3>
      <ul>
        <li>
          <strong>Location:</strong> when you grant location access, we use
          your precise location to place you on the map, to gate features
          that require you to be at a bar (for example contributing a line
          report), and to surface nearby bars and events. Some events let you
          choose how precisely your location is revealed to the group.
        </li>
        <li>
          <strong>Social graph:</strong> friend connections, crews you join,
          and the people you attend events with.
        </li>
        <li>
          <strong>Check-ins and visits:</strong> bars you currently are at, have
          visited, follow, or favorite.
        </li>
        <li>
          <strong>Line-report signals:</strong> when you submit a line report,
          we analyze your photo on your device using Apple Vision to estimate
          how many people are visible, then store the photo and its derived
          signals (for example a headcount estimate, timestamp, and bar) so the
          wait-time estimate can be shown to others.
        </li>
        <li>
          <strong>Promotion redemptions:</strong> when you redeem a bar
          promotion, we record the redemption with a timestamp and short-lived
          QR code so the bar can verify it.
        </li>
        <li>
          <strong>Device and log data:</strong> device model, OS version, app
          version, language, crash reports, and service logs collected by our
          backend providers.
        </li>
      </ul>

      <h3>We access only with your permission</h3>
      <ul>
        <li>
          <strong>Contacts:</strong> if you allow contact access, we use it
          solely to help you find friends who already use Sip. We do not upload
          your address book and we do not send invitations on your behalf
          without an explicit tap.
        </li>
        <li>
          <strong>Camera and photos:</strong> used when you take a photo for a
          post, a profile element, or a line report. We do not scan your camera
          roll.
        </li>
        <li>
          <strong>Notifications:</strong> used to send you RSVPs, friend
          requests, and nearby-bar alerts when you&rsquo;ve opted in.
        </li>
      </ul>

      <h2>How we use your information</h2>
      <ul>
        <li>Power the core product — the live map, crews, events, line intelligence, and bar profiles.</li>
        <li>Show your posts, comments, RSVPs, and visits to the audiences you choose (public, friends, or a specific crew).</li>
        <li>Compute wait-time estimates and crowd signals from reports contributed by you and others.</li>
        <li>Protect the service: detect spam, abuse, harassment, fake accounts, and content that violates our <a href="/terms">Terms</a>.</li>
        <li>Respond to reports, block requests, and support emails.</li>
        <li>Comply with legal obligations — for example, responding to a valid subpoena.</li>
        <li>Improve Sip: understand which features get used, where things break, and what to build next.</li>
      </ul>

      <h2>How information is shared</h2>

      <h3>With other people, by design</h3>
      <ul>
        <li>
          Your username, initials, city, and posts are visible to other Sip
          users within the visibility you choose. Setting your profile to
          private limits what people who aren&rsquo;t your friends see.
        </li>
        <li>
          Friends, crew members, and people you invite to an event can see
          details you share into those surfaces — for example your current bar,
          RSVPs, or messages in the crew.
        </li>
        <li>
          Bars you check into, visit, or represent can see aggregate signals
          about their venue (headcount estimates, visitor count, regulars vs.
          discovery) and the content you post tagged to them.
        </li>
      </ul>

      <h3>With service providers (&ldquo;processors&rdquo;)</h3>
      <p>
        Sip runs on third-party infrastructure. These providers process data
        on our behalf, under contract, only to operate Sip:
      </p>
      <ul>
        <li>
          <strong>Google / Firebase</strong> — Authentication, Firestore,
          Cloud Storage, Cloud Functions, Hosting, and Crashlytics.
        </li>
        <li>
          <strong>Apple</strong> — Push Notification Service, Sign in with
          Apple (if you choose it), and on-device Vision used for headcount
          estimation.
        </li>
        <li>
          <strong>Google Sign-In</strong> — authentication when you choose it.
        </li>
        <li>
          <strong>Vercel</strong> — hosting for this website.
        </li>
      </ul>

      <h3>For legal reasons and safety</h3>
      <p>
        We may disclose information if we believe in good faith it is necessary
        to comply with law, enforce our <a href="/terms">Terms</a>, protect the
        rights and safety of Sip&rsquo;s users, or investigate fraud.
      </p>

      <h3>In a business transaction</h3>
      <p>
        If Sip is involved in a merger, acquisition, or sale of assets, your
        information may be transferred, subject to this policy or one at least
        as protective.
      </p>

      <h2>We do not sell your data</h2>
      <p>
        Sip does not sell personal information and does not share it with
        third parties for their own advertising. Promotions you see inside
        Sip come from bars on Sip and are targeted using the information in
        your Sip account — not by external ad networks.
      </p>

      <h2>Data retention</h2>
      <ul>
        <li>
          <strong>While your account exists</strong> — we keep the data needed
          to run Sip for you.
        </li>
        <li>
          <strong>After deletion</strong> — when you delete your account from
          <em> Edit profile → Delete my account</em>, we remove your profile and
          personally identifying information within 30 days. Aggregate signals
          that are no longer tied to you (for example anonymized wait-time
          estimates) may be retained.
        </li>
        <li>
          <strong>Line-report photos</strong> — retained for up to 24 hours, the
          window in which the estimate is useful, and then deleted.
        </li>
        <li>
          <strong>Backups and logs</strong> — retained up to 90 days for
          security and recovery.
        </li>
      </ul>

      <h2>Your choices and rights</h2>
      <ul>
        <li>
          <strong>Access, correct, export, delete:</strong> edit or delete your
          profile at any time from inside the app, or email{" "}
          <a href="mailto:sam@sipapp.co">sam@sipapp.co</a> for a copy of your
          data.
        </li>
        <li>
          <strong>Permissions:</strong> revoke Location, Notifications,
          Contacts, or Camera access in iOS Settings at any time. Sip will keep
          working, with fewer features.
        </li>
        <li>
          <strong>Block and report:</strong> any profile, post, or comment can
          be reported, and any user can be blocked, from inside the app. Once
          blocked, that user can&rsquo;t see your content, friend you, or
          appear in your feed.
        </li>
        <li>
          <strong>California (CCPA/CPRA):</strong> California residents have
          the right to know, correct, delete, and limit use of their personal
          information, and to not be discriminated against for exercising
          those rights.
        </li>
        <li>
          <strong>EEA/UK (GDPR):</strong> if you use Sip from the EEA or UK,
          our legal basis for processing is your consent, performance of our
          contract with you, and our legitimate interest in running a safe,
          functional service. You may object, request portability, or lodge a
          complaint with your local data-protection authority.
        </li>
      </ul>

      <h2>Security</h2>
      <p>
        Sip uses industry-standard encryption in transit (TLS) and at rest,
        Firebase security rules to scope what each account can read and write,
        and short-lived credentials for sensitive actions. No system is
        perfect. If you believe your account has been compromised, email{" "}
        <a href="mailto:sam@sipapp.co">sam@sipapp.co</a> immediately.
      </p>

      <h2>Children</h2>
      <p>
        Sip is not directed to children under 13, and because Sip is a nightlife
        product we do not permit anyone under 21 to create an account at all.
      </p>

      <h2>International transfers</h2>
      <p>
        Sip&rsquo;s infrastructure is hosted primarily in the United States. If
        you use Sip from outside the U.S., your information will be transferred
        to and processed in the U.S.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        When we make material changes, we&rsquo;ll update the effective date
        above and, where appropriate, notify you inside the app before the
        change takes effect.
      </p>

      <h2>Contact</h2>
      <p>
        Sip, Inc. — privacy questions, deletion requests, and complaints:{" "}
        <a href="mailto:sam@sipapp.co">sam@sipapp.co</a>.
      </p>
    </LegalPage>
  );
}

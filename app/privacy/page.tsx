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
      effectiveDate="May 28, 2026"
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
        operated by White Pine Enterprises, LLC (&ldquo;Sip,&rdquo; &ldquo;we,&rdquo;
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
          <strong>Google / Firebase</strong> &mdash; Authentication,
          Firestore, Cloud Storage, Cloud Functions, Hosting, and
          Crashlytics (crash reporting). We rely on Google&rsquo;s data
          processing addendum so these services act as service providers
          on our behalf. We do not run Google Analytics, AdMob, or any
          other Google advertising product against your Sip data.
        </li>
        <li>
          <strong>Apple</strong> &mdash; Push Notification Service, Sign in
          with Apple (if you choose it), and on-device Vision used for
          headcount estimation.
        </li>
        <li>
          <strong>Google Sign-In</strong> &mdash; authentication when you
          choose it.
        </li>
        <li>
          <strong>Vercel</strong> &mdash; hosting for this website.
        </li>
        <li>
          <strong>Resend</strong> &mdash; transactional email delivery
          (waitlist confirmations, password resets, account notifications).
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

      <h2>We do not sell or share your data for advertising</h2>
      <p>
        Sip does not sell personal information for money. Sip does not
        share personal information with third parties for cross-context
        behavioral advertising as those terms are defined under the
        California Privacy Rights Act (CPRA). We do not run Google
        Analytics, AdMob, or any other advertising technology against
        your Sip data. Promotions you see inside Sip come from bars
        listed on Sip and are targeted using your Sip account
        information only &mdash; not by external ad networks.
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
          <strong>EEA/UK (GDPR):</strong> if you use Sip from the EEA or UK,
          our legal basis for processing is your consent, performance of our
          contract with you, and our legitimate interest in running a safe,
          functional service. You may object, request portability, or lodge a
          complaint with your local data-protection authority.
        </li>
      </ul>

      <h2>California privacy rights (CCPA / CPRA)</h2>
      <p>
        If you are a California resident, the California Consumer Privacy
        Act, as amended by the California Privacy Rights Act, gives you the
        rights described below. The look-back period for the disclosures in
        this section is the prior twelve months.
      </p>

      <h3>Categories of personal information we collect</h3>
      <ul>
        <li>
          <strong>Identifiers</strong> &mdash; name, username, email,
          account ID, IP address, device identifiers.
        </li>
        <li>
          <strong>Customer records</strong> &mdash; date of birth (used to
          confirm 21+), city, hashed password.
        </li>
        <li>
          <strong>Commercial information</strong> &mdash; promotions you
          redeem, bars you follow or favorite, events you RSVP to.
        </li>
        <li>
          <strong>Internet and network activity</strong> &mdash; in-app
          interactions, screens viewed, and crash reports.
        </li>
        <li>
          <strong>Geolocation</strong> &mdash; precise location while the
          app is in use. This is &ldquo;sensitive personal information&rdquo;
          under CPRA.
        </li>
        <li>
          <strong>Audio, visual, or similar information</strong> &mdash;
          photos you upload (posts, profile elements, line-report photos).
        </li>
        <li>
          <strong>Inferences</strong> &mdash; derived signals such as the
          headcount estimate from a line-report photo or whether you are a
          regular versus first-time visitor at a bar.
        </li>
        <li>
          <strong>Sensitive personal information</strong> &mdash; precise
          geolocation and the hashed password used to log in to your account.
        </li>
      </ul>
      <p>
        Sip does not collect: government identification numbers, financial
        account information, racial or ethnic origin, religious beliefs,
        union membership, genetic data, biometric identifiers, health
        information, or information about sex life or sexual orientation.
      </p>

      <h3>Where we collect from</h3>
      <p>
        Directly from you (account creation and app use); from your device
        (location, camera, contacts &mdash; with your permission); from
        authentication providers you choose (Apple, Google); and from other
        Sip users who interact with you in the product.
      </p>

      <h3>Why we collect</h3>
      <p>
        To operate Sip (map, crews, events, line and crowd intelligence,
        bar profiles); to authenticate and protect your account; to enforce
        our <a href="/terms">Terms</a> and respond to abuse, fraud, and
        safety reports; to comply with legal obligations; and to understand
        how Sip is used in aggregate so we can improve the product.
      </p>

      <h3>Who we disclose personal information to</h3>
      <p>
        The categories of recipients identified earlier in this policy:
        service providers operating Sip on our behalf (Google/Firebase,
        Apple, Vercel, Resend); bars whose venues you check into or
        represent (limited to the signals and content you share into those
        surfaces); other Sip users (limited to your visibility settings);
        and law enforcement or other parties where required by law. We do
        not sell personal information and we do not share personal
        information for cross-context behavioral advertising.
      </p>

      <h3>Your California rights</h3>
      <ol>
        <li>
          <strong>Right to know.</strong> Request the categories and
          specific pieces of personal information we have collected, the
          sources, the purposes, and the categories of third parties we
          disclose to.
        </li>
        <li>
          <strong>Right to correct.</strong> Ask us to correct inaccurate
          personal information we hold about you.
        </li>
        <li>
          <strong>Right to delete.</strong> Request deletion of personal
          information we hold about you, subject to limited statutory
          exceptions (for example, completing a transaction you requested,
          security, or legal compliance).
        </li>
        <li>
          <strong>Right to opt out of sale or sharing.</strong> We do not
          sell personal information and we do not share personal
          information for cross-context behavioral advertising, so there
          is nothing to opt out of today. If that ever changes, we will
          update this policy, notify you in the app, and add the
          opt-out mechanism required by California law.
        </li>
        <li>
          <strong>Right to limit the use of sensitive personal
          information.</strong> Sip already limits the use of sensitive
          personal information (precise geolocation, hashed credentials)
          to providing the service you requested and to safety and fraud
          purposes permitted by law. You may ask us in writing to further
          restrict our use.
        </li>
        <li>
          <strong>Right to non-discrimination.</strong> We will not deny
          service, charge different prices, or provide a different quality
          of service because you exercised any of these rights.
        </li>
        <li>
          <strong>Authorized agents.</strong> You may designate an
          authorized agent to make a request on your behalf, with written
          authorization that we can verify.
        </li>
      </ol>

      <h3>How to exercise your California rights</h3>
      <p>
        Email{" "}
        <a href="mailto:sam@sipapp.co?subject=California%20privacy%20request">
          sam@sipapp.co
        </a>{" "}
        with the subject line &ldquo;California privacy request&rdquo; and
        tell us which right you want to exercise. We will verify your
        identity by asking for information that matches your Sip account.
        We respond within 45 days, with one 45-day extension if reasonably
        necessary (we will tell you in writing if we need the extension).
        You can also delete your account from inside the app at
        <em> Edit profile &rarr; Delete my account</em>.
      </p>

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

      <h2>DMCA Notice</h2>
      <p>
        Sip respects the intellectual property rights of others and expects
        users of the platform to do the same.
      </p>
      <p>
        If you believe content available on Sip infringes your copyright,
        you may submit a notification under the Digital Millennium
        Copyright Act (DMCA) by providing our designated copyright agent
        with the following information:
      </p>
      <ul>
        <li>
          Identification of the copyrighted work claimed to have been
          infringed
        </li>
        <li>
          Identification of the infringing material and information
          reasonably sufficient to permit us to locate the material
        </li>
        <li>
          Your contact information, including name, address, telephone
          number, and email address
        </li>
        <li>
          A statement that you have a good faith belief that the disputed
          use is not authorized
        </li>
        <li>
          A statement, under penalty of perjury, that the information in
          the notification is accurate
        </li>
        <li>Your physical or electronic signature</li>
      </ul>
      <p>DMCA notices should be sent to:</p>
      <p>
        White Pine Enterprises, LLC Copyright Agent
        <br />
        Email:{" "}
        <a href="mailto:sam@sipapp.co">sam@sipapp.co</a>
      </p>
      <p>
        Sip may remove allegedly infringing content and terminate repeat
        infringers where appropriate. Full takedown and
        counter-notification procedures are in our{" "}
        <a href="/dmca">DMCA &amp; Copyright Policy</a>.
      </p>

      <h2>Contact</h2>
      <p>
        White Pine Enterprises, LLC — privacy questions, deletion requests, and complaints:{" "}
        <a href="mailto:sam@sipapp.co">sam@sipapp.co</a>.
      </p>
    </LegalPage>
  );
}

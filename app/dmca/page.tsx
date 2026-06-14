import type { Metadata } from "next";
import { LegalPage } from "../components/LegalPage";

export const metadata: Metadata = {
  title: "DMCA & Copyright Policy — Sip",
  description:
    "How to report copyright infringement on Sip, how the takedown process works, and the rules for repeat infringers.",
};

export default function DMCAPage() {
  return (
    <LegalPage
      eyebrow="DMCA"
      title="DMCA & Copyright Policy"
      effectiveDate="May 28, 2026"
    >
      <p>
        Sip respects the intellectual property rights of others and expects
        users of the platform to do the same. This policy explains how to
        report copyright infringement on Sip, how Sip responds, and the
        consequences for users who repeatedly infringe.
      </p>

      <h2>Notification of claimed infringement</h2>
      <p>
        If you believe content available on Sip infringes your copyright,
        you may submit a notification under the Digital Millennium
        Copyright Act (the &ldquo;DMCA&rdquo;) by providing our designated
        copyright agent with the following information, which must be in
        writing and substantially compliant with 17 U.S.C. &sect; 512(c)(3):
      </p>
      <ol>
        <li>
          Identification of the copyrighted work claimed to have been
          infringed (or, if a single notification covers multiple works,
          a representative list of those works).
        </li>
        <li>
          Identification of the material that you claim is infringing,
          with information reasonably sufficient to permit us to locate
          the material on Sip &mdash; for example, the URL of the post,
          the username of the account, or screenshots.
        </li>
        <li>
          Your contact information, including your full name, mailing
          address, telephone number, and email address.
        </li>
        <li>
          A statement that you have a good-faith belief that the disputed
          use is not authorized by the copyright owner, its agent, or the
          law.
        </li>
        <li>
          A statement, under penalty of perjury, that the information in
          the notification is accurate and that you are the copyright
          owner or are authorized to act on the owner&rsquo;s behalf.
        </li>
        <li>Your physical or electronic signature.</li>
      </ol>

      <h2>Designated copyright agent</h2>
      <p>DMCA notifications should be sent to:</p>
      <p>
        White Pine Enterprises, LLC &mdash; Copyright Agent
        <br />
        Email:{" "}
        <a href="mailto:sam@sipapp.co">sam@sipapp.co</a>
      </p>
      <p>
        Notices that do not substantially comply with the requirements
        above may not receive a response. Sending a notice that does not
        relate to a copyrighted work you own, or that you know to be
        false, may expose you to liability (see &ldquo;Misuse of the DMCA
        process&rdquo; below).
      </p>

      <h2>What happens after we receive a valid notice</h2>
      <p>
        When we receive a notice that substantially complies with the
        DMCA, we will:
      </p>
      <ul>
        <li>
          Expeditiously remove or disable access to the material claimed
          to be infringing;
        </li>
        <li>
          Take reasonable steps to notify the user who posted the
          material that it has been removed; and
        </li>
        <li>
          Record the notice and our action for our internal compliance
          log.
        </li>
      </ul>

      <h2>Counter-notification</h2>
      <p>
        If we removed or disabled access to content you posted and you
        believe the removal was the result of a mistake or
        misidentification, you may submit a counter-notification to{" "}
        <a href="mailto:sam@sipapp.co">sam@sipapp.co</a> that includes:
      </p>
      <ol>
        <li>Your physical or electronic signature.</li>
        <li>
          Identification of the material that was removed or disabled and
          the location at which the material appeared before removal.
        </li>
        <li>
          A statement, under penalty of perjury, that you have a
          good-faith belief that the material was removed or disabled as
          a result of mistake or misidentification.
        </li>
        <li>
          Your name, mailing address, telephone number, and email
          address, and a statement that you consent to the jurisdiction
          of the federal court located in New York County, New York, and
          that you will accept service of process from the person who
          submitted the original notification or that person&rsquo;s
          agent.
        </li>
      </ol>
      <p>
        Following a valid counter-notification, we may restore the
        removed material within 10 to 14 business days unless we receive
        notice that the original complainant has filed a court action
        seeking to keep the material down.
      </p>

      <h2>Repeat-infringer policy</h2>
      <p>
        Sip will, in appropriate circumstances and at its sole
        discretion, terminate the accounts of users who are determined to
        be repeat infringers. We may also remove allegedly infringing
        content, suspend access, and take any other action we consider
        necessary to comply with the DMCA and to protect intellectual
        property rights.
      </p>

      <h2>Misuse of the DMCA process</h2>
      <p>
        Under 17 U.S.C. &sect; 512(f), any person who knowingly materially
        misrepresents that material is infringing, or that material was
        removed by mistake or misidentification, may be liable for
        damages, including costs and attorneys&rsquo; fees, incurred by
        the alleged infringer, the copyright owner, or Sip. Submit
        notices only if you genuinely believe the disputed use is
        unauthorized and that the information you provide is accurate.
      </p>

      <h2>Not legal advice</h2>
      <p>
        This page describes Sip&rsquo;s process for handling DMCA
        notices. It is not legal advice. If you are unsure whether a
        particular use is infringing, or whether to submit a notice or
        counter-notification, consult an attorney.
      </p>
    </LegalPage>
  );
}

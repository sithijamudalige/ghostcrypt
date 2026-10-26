const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf8');
const urlMatch = env.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
const keyMatch = env.match(/NEXT_PUBLIC_SUPABASE_ANON_KEY=(.+)/);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(urlMatch[1].trim(), keyMatch[1].trim());

async function fixAndAddQuizzes() {
  // 1. Fix Question 1
  await supabase.from('questions').update({
    question_text: 'What is the primary purpose of Inter-VLAN Routing (IVR)?',
    options: [
      'To increase wireless signal strength',
      'To isolate physical cables',
      'To allow communication between different VLANs',
      'To assign MAC addresses'
    ]
  }).eq('id', '0254c1f9-036e-411d-91c5-df388dcff753');
  console.log('Fixed Question 1 text.');

  // 2. Add Quiz 2: VLANs & 802.1Q Trunking
  const { data: q2 } = await supabase.from('quizzes').insert([{
    title: 'CCNA VLANs & 802.1Q Trunking Quiz',
    description: 'Test your understanding of Virtual Local Area Networks, access ports, trunk encapsulation, and native VLAN security.'
  }]).select().single();

  if (q2) {
    console.log('Created Quiz 2:', q2.id);
    await supabase.from('questions').insert([
      {
        quiz_id: q2.id,
        question_text: 'What is the IEEE standard used for VLAN tagging on Ethernet trunk links?',
        options: ['IEEE 802.11ax', 'IEEE 802.1Q', 'IEEE 802.3ad', 'IEEE 802.1D'],
        correct_answer: 'IEEE 802.1Q'
      },
      {
        quiz_id: q2.id,
        question_text: 'What happens to broadcast traffic inside a single VLAN?',
        options: [
          'It is forwarded to all VLANs automatically',
          'It is confined strictly to members of that specific VLAN',
          'It is dropped immediately by the switch',
          'It is converted into a unicast frame'
        ],
        correct_answer: 'It is confined strictly to members of that specific VLAN'
      },
      {
        quiz_id: q2.id,
        question_text: 'What is the default Native VLAN on Cisco Catalyst switches?',
        options: ['VLAN 10', 'VLAN 99', 'VLAN 1', 'VLAN 100'],
        correct_answer: 'VLAN 1'
      },
      {
        quiz_id: q2.id,
        question_text: 'Which Cisco IOS command configures an interface to carry multiple VLANs?',
        options: [
          'switchport mode access',
          'switchport mode trunk',
          'switchport mode dynamic auto',
          'ip routing'
        ],
        correct_answer: 'switchport mode trunk'
      }
    ]);
  }

  // 3. Add Quiz 3: EtherChannel & Link Aggregation
  const { data: q3 } = await supabase.from('quizzes').insert([{
    title: 'EtherChannel (LACP & PAgP) Quiz',
    description: 'Assess your knowledge of port channels, load balancing methods, Cisco PAgP, and IEEE 802.3ad LACP.'
  }]).select().single();

  if (q3) {
    console.log('Created Quiz 3:', q3.id);
    await supabase.from('questions').insert([
      {
        quiz_id: q3.id,
        question_text: 'Which protocol is the open industry-standard for Link Aggregation (EtherChannel)?',
        options: ['PAgP', 'LACP (IEEE 802.3ad)', 'CDP', 'VTP'],
        correct_answer: 'LACP (IEEE 802.3ad)'
      },
      {
        quiz_id: q3.id,
        question_text: 'Which two LACP channel-group modes can successfully negotiate an EtherChannel bundle?',
        options: [
          'Active and Active',
          'Passive and Passive',
          'Desirable and Auto',
          'On and Active'
        ],
        correct_answer: 'Active and Active'
      },
      {
        quiz_id: q3.id,
        question_text: 'What is the maximum number of active physical links in a standard Cisco EtherChannel?',
        options: ['2', '4', '8', '16'],
        correct_answer: '8'
      },
      {
        quiz_id: q3.id,
        question_text: 'Which command confirms whether an EtherChannel bundle is bundled (SU / Port-Channel up)?',
        options: [
          'show etherchannel summary',
          'show vlan brief',
          'show ip route',
          'show mac address-table'
        ],
        correct_answer: 'show etherchannel summary'
      }
    ]);
  }

  console.log('All quizzes and questions updated successfully!');
}
fixAndAddQuizzes();

import br from 'backroad-sdk';

function getDouble(num: number) {
  return num * 2;
}

(async () => {
  const val = await br.numberInput({
    label: 'Enter Value',
    defaultValue: 5,
    id: 'numinput',
  });
  br.button({ label: 'Submit', id: 'submit' });
  const ans = getDouble(val);
  br.write({ body: `Function result returned: ${ans}` });
})();

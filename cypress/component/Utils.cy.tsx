import { mergeWithStrategy, travelTree, turnArray } from '@koala-form/core';
import { reactive, ref } from 'vue';

describe('工具方法', () => {
    it('turnArray', () => {
        expect(turnArray(1)[0]).eq(1);
        expect(turnArray([1, 2])[1]).eq(2);
        expect(turnArray()[0]).eq(undefined);
    });

    it('travelTree', () => {
        const root = [
            {
                name: '1',
                children: [
                    {
                        name: '2-1',
                    },
                    {
                        name: '2-2',
                        children: [{ name: '3-1' }],
                    },
                ],
            },
        ];
        const path = ['1', '2-1', '2-2', '3-1'];
        const tPath: typeof path = [];
        travelTree(root, (node) => {
            tPath.push(node.name);
        });

        expect(tPath.join(',')).eq(path.join(','));
    });

    it('mergeWithStrategy', () => {
        const obj: Record<string, any> = {
            id: 1,
            children: [1, 2, 3],
            address: {
                province: '湖南',
                city: '长沙',
            },
            labelRef: 1,
        };
        const newAddress = reactive({ province: '广东' });
        mergeWithStrategy(obj, { id: 2, name: 'aring', children: [11, 22] });
        expect(obj.id).eq(2);
        expect(obj.name).eq('aring');
        expect(obj.children.join()).eq('11,22,3');

        mergeWithStrategy(obj, { children: [4] }, { array: 'concat' });
        expect(obj.children.join()).eq('11,22,3,4');

        mergeWithStrategy(obj, { children: [5, 6] }, { array: 'override' });
        expect(obj.children.join()).eq('5,6');

        mergeWithStrategy(obj, { address: newAddress, labelRef: ref(2) });

        expect(obj.address.province).eq('广东');
        expect(obj.address.city).eq(undefined);
        expect(obj.labelRef.value).eq(2);

        newAddress.province = '广西';
        expect(obj.address.province).eq('广西');
    });
});
